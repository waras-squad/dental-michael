import { db } from '@/db';
import {
  Admin,
  academics,
  achievements,
  certificates,
  doctors,
  experiences,
} from '@/db/schemas';
import { AccountActivity, AccountType } from '@/enum';
import { customError, formatPhone, omit } from '@/helpers';
import {
  AcademicDTO,
  BackgroundType,
  CreateDoctorDTO,
  UpdateDoctorDTO,
  backgroundSchemaMap,
} from '@/validators/doctor.dto';
import { AccountActivityLogService } from './accountActivityLog.service';
import { ChangePasswordDTO, PostgresError } from '@/validators';
import { CONSTRAINT_NAME, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';
import { and, eq, notInArray } from 'drizzle-orm';
import { uploadFiles } from '@/utils';

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

  static async checkDoctorExist(id: string) {
    const doctor = await db.query.doctors.findFirst({
      where({ id: doctor_id }, { eq }) {
        return eq(doctor_id, id);
      },
    });

    if (!doctor) {
      return customError(404, ERROR_MESSAGES.NOT_FOUND('Doctor', id));
    }
    return doctor;
  }

  static async create(payload: CreateDoctorDTO, admin: Admin) {
    const [profile_picture] = await uploadFiles([payload.profile_picture]);

    const phone = formatPhone(payload.phone);
    const password = await Bun.password.hash(payload.password);
    console.log(payload);

    try {
      await db.transaction(async (tx) => {
        const [doctor] = await tx
          .insert(doctors)
          .values({
            ...payload,
            phone,
            password,
            tax: payload.tax?.toString(),
            profile_picture,
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

  static async changePassword(
    id: string,
    payload: ChangePasswordDTO,
    admin?: Admin
  ) {
    const { old_password, new_password } = payload;

    const doctor = await db.query.doctors.findFirst({
      where({ id: doctor_id }, { eq }) {
        return eq(doctor_id, id);
      },
    });

    if (
      !doctor ||
      !(await Bun.password.verify(doctor.password, old_password))
    ) {
      return customError(403, ERROR_MESSAGES.WRONG_PASSWORD);
    }

    const password = await Bun.password.hash(new_password);

    try {
      await db.transaction(async (tx) => {
        await tx.update(doctors).set({ password }).where(eq(doctors.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor.id,
          actor_id: admin?.id || doctor.id,
          action: AccountActivity.CHANGE_PASSWORD,
          target_type: AccountType.USER,
          actor_type: admin ? AccountType.ADMIN : AccountType.DOCTOR,
          details: { activity: AccountActivity.CHANGE_PASSWORD },
        });
      });
    } catch (error) {
      console.error(error.message);
      return customError(500, ERROR_MESSAGES.CHANGE_PASSWORD);
    }
  }

  static async delete(id: string, admin: Admin) {
    const doctor = await this.checkDoctorExist(id);

    if (!doctor.is_active) {
      return customError(409, ERROR_MESSAGES.ALREADY_DELETED('Doctor'));
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(doctors)
          .set({ is_active: false })
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
    const doctor = await this.checkDoctorExist(id);

    if (doctor.is_active) {
      return customError(409, ERROR_MESSAGES.ALREADY_ACTIVE('Doctor', id));
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(doctors)
          .set({ is_active: true })
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

  static async update(id: string, payload: UpdateDoctorDTO, admin: Admin) {
    const doctor = await this.checkDoctorExist(id);

    //? Only update if payload.profile_picture is a file
    const profile_picture = !payload.profile_picture
      ? undefined
      : typeof payload.profile_picture === 'string'
      ? undefined
      : (await uploadFiles([payload.profile_picture]))[0];

    try {
      await db.transaction(async (tx) => {
        await tx
          .update(doctors)
          .set({
            ...payload,
            profile_picture,
            tax: payload.tax?.toString() || undefined,
          })
          .where(eq(doctors.id, id));

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor.id,
          target_type: AccountType.DOCTOR,
          actor_id: admin.id,
          actor_type: AccountType.ADMIN,
          action: AccountActivity.UPDATE,
          details: payload,
        });

        return SUCCESS_MESSAGES.UPDATE_ENTITY('Doctor', id);
      });
    } catch (error) {
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

      return customError(500, ERROR_MESSAGES.UPDATE_ENTITY('Doctor', id));
    }
  }

  /**
   * Function to create or update background for a doctor.
   * If id is provided, it will be updated, otherwise it will be created.
   * The rest will be deleted
   */
  static async createOrUpdateBackground(
    doctor_id: string,
    backgroundType: keyof BackgroundType,
    payloads: BackgroundType[keyof BackgroundType],
    admin?: Admin
  ) {
    const doctor = await this.checkDoctorExist(doctor_id);
    const background = backgroundSchemaMap[backgroundType];

    try {
      await db.transaction(async (tx) => {
        const ids: number[] = [];
        for (const data of payloads) {
          const [returnedBackground] = await tx
            .insert(background)
            .values({ doctor_id, ...data })
            .onConflictDoUpdate({ target: background.id, set: { ...data } })
            .returning({
              id: background.id,
            });

          await AccountActivityLogService.insertToLog(tx, {
            target_id: doctor.id,
            target_type: AccountType.DOCTOR,
            actor_id: admin?.id ?? doctor.id,
            actor_type: admin ? AccountType.ADMIN : AccountType.DOCTOR,
            action: AccountActivity.MODIFY_ACADEMIC,
            details: data,
          });

          ids.push(returnedBackground.id);
        }

        await tx
          .delete(background)
          .where(
            and(
              eq(background.doctor_id, doctor_id),
              notInArray(background.id, ids)
            )
          );
      });

      return SUCCESS_MESSAGES.MODIFY_DOCTOR_BACKGROUND(
        backgroundType,
        doctor_id
      );
    } catch (error) {
      console.error(error);
      return customError(
        500,
        ERROR_MESSAGES.MODIFY_DOCTOR_BACKGROUND(backgroundType, doctor_id)
      );
    }
  }
}
