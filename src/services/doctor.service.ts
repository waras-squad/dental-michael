import { db } from '@/db';
import {
  Admin,
  Doctor,
  academics,
  achievements,
  certificates,
  doctorSchedules,
  doctorTreatments,
  doctors,
  experiences,
} from '@/db/schemas';
import { AccountActivity, AccountType } from '@/enum';
import { customError, formatPhone, omit, validateTime } from '@/helpers';
import { AccountActivityLogService } from './accountActivityLog.service';
import {
  BackgroundType,
  ChangePasswordDTO,
  CreateDoctorDTO,
  DoctorScheduleDTO,
  PostgresError,
  DoctorTreatmentDTO,
  UpdateDoctorDTO,
  ValidateLogin,
  GetDoctorListFilterDTO,
  GetDoctorSortBy,
} from '@/validators';

import { CONSTRAINT_NAME, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';
import { uploadFiles } from '@/utils';

import {
  AnyColumn,
  SQL,
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  notInArray,
} from 'drizzle-orm';

export class DoctorService {
  static backgroundSchemaMap = {
    academics: academics,
    experiences: experiences,
    certifications: certificates,
    achievements: achievements,
  };
  static async findDoctorById(id: string) {
    const doctor = await db.query.doctors.findFirst({
      where: (doctor, { eq }) => eq(doctor.id, id),
      columns: {
        password: false,
      },
    });
    return doctor;
  }

  static async findDoctorByIdWithBackground(id: string) {
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
      columns: {
        password: false,
      },
    });

    if (!doctor) {
      return customError(404, ERROR_MESSAGES.NOT_FOUND('Doctor', id));
    }
    return doctor;
  }

  static async login(payload: ValidateLogin) {
    const { username, password } = payload;

    const doctor = await db.query.doctors.findFirst({
      where: (doctor, { eq, or }) =>
        or(eq(doctor.username, username), eq(doctor.email, username)),
    });

    if (!doctor || !(await Bun.password.verify(password, doctor.password))) {
      return customError(401, ERROR_MESSAGES.INVALID_LOGIN);
    }

    if (!doctor.is_active) {
      return customError(403, ERROR_MESSAGES.ACCOUNT_DEACTIVATED);
    }

    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      gender: doctor.gender,
      dob: doctor.dob,
    };
  }

  static async create(payload: CreateDoctorDTO, admin: Admin) {
    const [profile_picture] = await uploadFiles([payload.profile_picture]);

    const phone = formatPhone(payload.phone);
    const password = await Bun.password.hash(payload.password);

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

        for (let i = 0; i < 7; i++) {
          await tx.insert(doctorSchedules).values({
            day_of_week: i,
            start_at: '07:00',
            end_at: '20:00',
            doctor_id: doctor.id,
          });
        }

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

  static async update(id: string, payload: UpdateDoctorDTO, admin?: Admin) {
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
          actor_id: admin ? admin.id : doctor.id,
          actor_type: admin ? AccountType.ADMIN : AccountType.DOCTOR,
          action: AccountActivity.UPDATE,
          details: payload,
        });

        return admin
          ? SUCCESS_MESSAGES.UPDATE_ENTITY('Doctor', id)
          : SUCCESS_MESSAGES.UPDATE_PROFILE;
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
    const background = this.backgroundSchemaMap[backgroundType];

    try {
      await db.transaction(async (tx) => {
        const ids: number[] = [];
        for (const data of payloads) {
          const [returnedBackground] = await tx
            .insert(background)
            .values({ doctor_id, ...data })
            .onConflictDoUpdate({ target: background.id, set: data })
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

      return admin
        ? SUCCESS_MESSAGES.MODIFY_DOCTOR_BACKGROUND(backgroundType, doctor_id)
        : SUCCESS_MESSAGES.MODIFY_DOCTOR_BACKGROUND_SELF(backgroundType);
    } catch (error) {
      console.error(error);
      return customError(
        500,
        ERROR_MESSAGES.MODIFY_DOCTOR_BACKGROUND(backgroundType, doctor_id)
      );
    }
  }

  static async updateSchedules(
    doctor_id: string,
    payloads: DoctorScheduleDTO,
    admin?: Admin
  ) {
    await this.checkDoctorExist(doctor_id);

    for (const p of payloads) {
      if (!validateTime(p.start_at) || !validateTime(p.end_at)) {
        return customError(422, ERROR_MESSAGES.INVALID_TIME('HH:mm'));
      }
    }

    const schedules = await db.query.doctorSchedules.findMany({
      where: and(
        eq(doctorSchedules.doctor_id, doctor_id),
        inArray(
          doctorSchedules.id,
          payloads.map((s) => s.id)
        )
      ),
    });

    if (schedules.length !== payloads.length) {
      const unavailableIds: number[] = [];
      for (const p of payloads) {
        if (!schedules.find((s) => s.id === p.id)) {
          unavailableIds.push(p.id);
        }
      }

      return customError(
        400,
        ERROR_MESSAGES.NOT_FOUND('Schedule', unavailableIds.join(', '))
      );
    }

    try {
      await db.transaction(async (tx) => {
        for (const p of payloads) {
          await tx
            .update(doctorSchedules)
            .set({ ...omit(p, ['id']) })
            .where(and(eq(doctorSchedules.id, p.id)));
        }

        await AccountActivityLogService.insertToLog(tx, {
          target_id: doctor_id,
          target_type: AccountType.DOCTOR,
          actor_id: admin?.id ?? doctor_id,
          actor_type: admin ? AccountType.ADMIN : AccountType.DOCTOR,
          action: AccountActivity.MODIFY_SCHEDULE,
          details: payloads.reduce((acc, { id, ...properties }) => {
            acc[id] = properties;
            return acc;
          }, {} as Record<number, unknown>),
        });
      });

      return admin
        ? SUCCESS_MESSAGES.MODIFY_DOCTOR_SERVICE(doctor_id, 'schedules')
        : SUCCESS_MESSAGES.MODIFY_DOCTOR_BACKGROUND_SELF('schedules');
    } catch (error) {
      console.error(error);
      return customError(
        500,
        ERROR_MESSAGES.MODITY_DOCTOR_SERVICES(doctor_id, 'schedules')
      );
    }
  }

  static async modifyTreatments(
    doctor_id: string,
    payloads: DoctorTreatmentDTO,
    admin?: Admin
  ) {
    await this.checkDoctorExist(doctor_id);

    try {
      await db.transaction(async (tx) => {
        const mentionedId: number[] = [];

        for (const p of payloads) {
          const [modifiedTreatment] = await tx
            .insert(doctorTreatments)
            .values({ doctor_id, ...p })
            .onConflictDoUpdate({
              target: doctorTreatments.id,
              set: omit(p, ['id']),
            })
            .returning({ id: doctorTreatments.id });

          mentionedId.push(modifiedTreatment.id);

          await AccountActivityLogService.insertToLog(tx, {
            target_id: doctor_id,
            target_type: AccountType.DOCTOR,
            actor_id: admin?.id ?? doctor_id,
            actor_type: admin ? AccountType.ADMIN : AccountType.DOCTOR,
            action: AccountActivity.MODIFY_TREATMENT,
            details: p,
          });
        }

        await tx
          .delete(doctorTreatments)
          .where(
            and(
              eq(doctorTreatments.doctor_id, doctor_id),
              notInArray(doctorTreatments.id, mentionedId)
            )
          );
      });

      return admin
        ? SUCCESS_MESSAGES.MODIFY_DOCTOR_SERVICE(doctor_id, 'treatments')
        : SUCCESS_MESSAGES.MODIFY_DOCTOR_BACKGROUND_SELF('treatments');
    } catch (error) {
      console.error(error);
      return ERROR_MESSAGES.MODITY_DOCTOR_SERVICES(doctor_id, 'treatments');
    }
  }

  static async getList(query: GetDoctorListFilterDTO) {
    const filters: SQL[] = [];

    for (const key in omit(query, ['page', 'limit', 'sort', 'dob'])) {
      const value =
        query[
          key as keyof Omit<GetDoctorListFilterDTO, 'page' | 'limit' | 'dob'>
        ];

      if (typeof value === 'string') {
        filters.push(ilike(doctors[key as keyof Doctor], `%${value}%`));
      }
    }

    if (typeof query.is_active === 'boolean') {
      filters.push(eq(doctors.is_active, query.is_active));
    }

    if (query.dob) {
      filters.push(eq(doctors.dob, query.dob));
    }

    const column = query.sort || GetDoctorSortBy.CREATED_AT_DESC;
    const order = column.startsWith('-') ? desc : asc;

    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    try {
      return await db.query.doctors.findMany({
        columns: {
          password: false,
        },
        where: and(...filters),
        limit,
        offset: (page - 1) * (limit ?? 10),
        orderBy: order(column.replace('-', '') as unknown as AnyColumn<Doctor>),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
