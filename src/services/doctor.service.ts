import { db } from '@/db';
import { Admin, doctors } from '@/db/schemas';
import { AccountActivity, AccountType } from '@/enum';
import { customError, formatPhone, omit } from '@/helpers';
import { CreateDoctorDTO } from '@/validators/doctor.dto';
import { AccountActivityLogService } from './accountActivityLog.service';
import { PostgresError } from '@/validators';
import { CONSTRAINT_NAME, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';
import { eq } from 'drizzle-orm';

export class DoctorService {
  static async findDoctorById(id: string) {
    const doctor = await db.query.doctors.findFirst({
      columns: {
        password: false,
      },
      where: (doctor, { eq }) => eq(doctor.id, id),
      with: {
        academics: true,
        certificates: true,
        experiences: true,
        schedules: true,
        achievements: true,
        treatments: true,
      },
    });
    return doctor;
  }
  static async create(payload: CreateDoctorDTO, admin: Admin) {
    const phone = formatPhone(payload.phone);
    const password = await Bun.password.hash(payload.password);
    console.log(payload);
    doctors.tax;

    try {
      await db.transaction(async (tx) => {
        const [doctor] = await tx
          .insert(doctors)
          .values({
            ...payload,
            phone,
            password,
            tax: payload.tax?.toString(),
          })
          .returning({ id: doctors.id });

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor.id,
          target_type: AccountType.DOCTOR,
          actor_id: admin.id,
          actor_type: AccountType.ADMIN,
          action: AccountActivity.CREATE,
          details: omit(payload, ['password']),
        });
      });

      return SUCCESS_MESSAGES.CREATE_ENTITY('Doctor');
    } catch (error) {
      console.error(error.message);
      const constraint = (error as PostgresError).constraint_name;
      switch (constraint) {
        case CONSTRAINT_NAME.DOCTOR.PHONE:
          return customError(409, ERROR_MESSAGES.DUPLICATE.PHONE);
        case CONSTRAINT_NAME.DOCTOR.EMAIL:
          return customError(409, ERROR_MESSAGES.DUPLICATE.EMAIL);
        case CONSTRAINT_NAME.DOCTOR.NIK:
          return customError(409, ERROR_MESSAGES.DUPLICATE.NIK);
        case CONSTRAINT_NAME.DOCTOR.USERNAME:
          return customError(409, ERROR_MESSAGES.DUPLICATE.USERNAME);
      }

      return customError(500, ERROR_MESSAGES.CREATE_ENTITY('Doctor'));
    }
  }

  static async delete(id: string, admin: Admin) {
    const doctor = await this.findDoctorById(id);
    if (!doctor) {
      return customError(404, ERROR_MESSAGES.NOT_FOUND('Doctor', id));
    }

    if (doctor.deleted_at) {
      return customError(409, ERROR_MESSAGES.ALREADY_DELETED('Doctor'));
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(doctors)
          .set({ deleted_at: new Date(), is_active: false })
          .where(eq(doctors.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor.id,
          target_type: AccountType.DOCTOR,
          actor_id: admin.id,
          actor_type: AccountType.ADMIN,
          action: AccountActivity.DELETE,
          details: { id, deleted_by: admin.username },
        });
      });

      return SUCCESS_MESSAGES.DELETE_ENTITY('Doctor', id);
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.DELETE_ENTITY('Doctor', id));
    }
  }

  static async reactivate(id: string, admin: Admin) {
    const doctor = await this.findDoctorById(id);
    if (!doctor) {
      return customError(404, ERROR_MESSAGES.NOT_FOUND('Doctor', id));
    }

    if (!doctor.deleted_at) {
      return customError(409, ERROR_MESSAGES.ALREADY_ACTIVE('Doctor', id));
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(doctors)
          .set({ deleted_at: null, is_active: true })
          .where(eq(doctors.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor.id,
          target_type: AccountType.DOCTOR,
          actor_id: admin.id,
          actor_type: AccountType.ADMIN,
          action: AccountActivity.REACTIVATE,
          details: { id, reactivated_by: admin.username },
        });
      });

      return SUCCESS_MESSAGES.REACTIVATE_ENTITY('Doctor', id);
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.REACTIVATE_ENTITY('Doctor', id));
    }
  }
}
