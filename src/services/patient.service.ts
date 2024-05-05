import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';
import { db } from '@/db';
import { Admin, patients } from '@/db/schemas';
import { customError } from '@/helpers';
import {
  ChangePasswordDTO,
  CreatePatientDTO,
  EditPatientDTO,
  PostgresError,
} from '@/validators';
import { AccountActivityLogService } from './accountActivityLog.service';
import { AccountActivity, AccountType } from '@/enum';
import { eq } from 'drizzle-orm';

export class PatientService {
  static async getList() {
    return await db.query.patients.findMany({
      columns: {
        password: false,
      },
    });
  }

  static async findPatientById(id: string) {
    return await db.query.patients.findFirst({
      columns: {
        password: false,
      },
      where({ id: user_id }, { eq }) {
        return eq(user_id, id);
      },
    });
  }

  static async findPatientByIdOrThrowError(id: string) {
    const patient = await PatientService.findPatientById(id);
    if (!patient) {
      return customError(404, ERROR_MESSAGES.NOT_FOUND('Patient', id));
    }
    return patient;
  }

  static async create(payload: CreatePatientDTO, admin?: Admin) {
    const { email, nik, gender, dob, name, phone, profile_picture } = payload;

    const password = await Bun.password.hash(payload.password);

    try {
      await db.transaction(async (tx) => {
        const [patient] = await tx
          .insert(patients)
          .values({
            email,
            password,
            nik,
            gender,
            dob,
            name,
            phone,
            profile_picture,
            created_by: admin?.username || 'user',
          })
          .returning({ id: patients.id });

        await AccountActivityLogService.insertToLog(tx, {
          target_id: patient.id,
          actor_id: admin?.id || patient.id,
          action: AccountActivity.CREATE,
          target_type: AccountType.USER,
          actor_type: admin ? AccountType.ADMIN : AccountType.USER,
          details: { email, nik, gender, dob, name, phone, profile_picture },
        });
      });
      return SUCCESS_MESSAGES.CREATE_PATIENT;
    } catch (error) {
      console.error(error.message);
      if ((error as PostgresError).code === '23505') {
        return customError(409, ERROR_MESSAGES.DUPLICATE.PHONE);
      }

      return customError(500, ERROR_MESSAGES.CREATE_ENTITY('Patient'));
    }
  }

  static async update(id: string, payload: EditPatientDTO, admin?: Admin) {
    const { email, nik, gender, dob, name, phone, profile_picture } = payload;

    const patient = await this.findPatientByIdOrThrowError(id);

    try {
      await db.transaction(async (tx) => {
        await tx.update(patients).set({
          email,
          nik,
          gender,
          dob,
          name,
          phone,
          profile_picture,
        });

        await AccountActivityLogService.insertToLog(tx, {
          target_id: patient.id,
          actor_id: admin?.id || patient.id,
          action: AccountActivity.UPDATE,
          target_type: AccountType.USER,
          actor_type: admin ? AccountType.ADMIN : AccountType.USER,
          details: { email, nik, gender, dob, name, phone, profile_picture },
        });
      });
      return SUCCESS_MESSAGES.UPDATE_ENTITY('Patient', id);
    } catch (error) {
      console.error(error.message);
      if ((error as PostgresError).code === '23505') {
        return customError(409, ERROR_MESSAGES.DUPLICATE.PHONE);
      }
      return customError(500, ERROR_MESSAGES.UPDATE_ENTITY('Patient', id));
    }
  }

  static async changePassword(
    id: string,
    payload: ChangePasswordDTO,
    admin?: Admin
  ) {
    const { old_password, new_password } = payload;

    const patient = await db.query.patients.findFirst({
      where({ id: user_id }, { eq }) {
        return eq(user_id, id);
      },
    });

    if (
      !patient ||
      !(await Bun.password.verify(patient.password, old_password))
    ) {
      return customError(403, 'Wrong password');
    }

    const password = await Bun.password.hash(new_password);

    try {
      await db.transaction(async (tx) => {
        await tx.update(patients).set({ password }).where(eq(patients.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: patient.id,
          actor_id: admin?.id || patient.id,
          action: AccountActivity.CHANGE_PASSWORD,
          target_type: AccountType.USER,
          actor_type: admin ? AccountType.ADMIN : AccountType.USER,
          details: { activity: AccountActivity.CHANGE_PASSWORD },
        });
      });
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.CHANGE_PASSWORD);
    }
  }

  static async delete(id: string, admin?: Admin) {
    const patient = await this.findPatientByIdOrThrowError(id);

    if (patient.deleted_at) {
      return customError(400, ERROR_MESSAGES.ALREADY_DELETED('Patient'));
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(patients)
          .set({ deleted_at: new Date() })
          .where(eq(patients.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: patient.id,
          actor_id: admin?.id || patient.id,
          action: AccountActivity.DELETE,
          target_type: AccountType.USER,
          actor_type: admin ? AccountType.ADMIN : AccountType.USER,
          details: { id, deleted_by: admin?.username || 'SELF' },
        });
      });

      return SUCCESS_MESSAGES.DELETE_ENTITY('Patient', id);
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.DELETE_ENTITY('Patient', id));
    }
  }
}
