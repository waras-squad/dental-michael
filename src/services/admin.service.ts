import { customError, omit } from '@/helpers';
import { CreateAdminDTO, PostgresError, ValidateLogin } from '@/validators';
import { db } from '@/db';
import { Admin, admins } from '@/db/schemas';
import { AccountActivityLogService } from './accountActivityLog.service';
import { AccountActivity, AccountType } from '@/enum';
import { CONSTRAINT_NAME, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/const';

export class AdminService {
  static async list() {
    // return await db
    //   .select({
    //     id: admins.id,
    //     username: admins.username,
    //   })
    //   .from(admins)
    //   .execute();

    return await db.query.admins.findMany({
      columns: {
        password: false,
      },
    });
  }

  static async login(payload: ValidateLogin) {
    const { username, password } = payload;
    const admin = await db.query.admins.findFirst({
      where: (admin, { eq }) => eq(admin.username, username),
    });

    // const [admin] = await db
    //   .selectDistinct()
    //   .from(admins)
    //   .where(eq(admins.username, username))
    //   .limit(1)
    //   .execute();

    if (!admin || !(await Bun.password.verify(password, admin.password))) {
      return customError(401, 'Invalid username or password');
    }

    return {
      id: admin.id,
      email: admin.email,
      gender: admin.gender,
      dob: admin.dob,
      role: admin.role,
    };
  }

  static async findAdminById(id: string) {
    return await db.query.admins.findFirst({
      where: (admin, { eq }) => eq(admin.id, id),
    });
  }

  static async create(payload: CreateAdminDTO, admin: Admin) {
    const { username, email, role, dob, gender } = payload;

    if (admin.role !== 'superadmin') {
      return customError(403, ERROR_MESSAGES.FORBIDDEN);
    }

    const password = await Bun.password.hash(payload.password);

    try {
      await db.transaction(async (tx) => {
        const [admin] = await tx
          .insert(admins)
          .values({
            username,
            email,
            password,
            role,
            dob,
            gender,
          })
          .returning({ id: admins.id });

        await AccountActivityLogService.insertToLog(tx, {
          target_id: admin.id,
          target_type: AccountType.ADMIN,
          actor_id: admin.id,
          actor_type: AccountType.ADMIN,
          action: AccountActivity.CREATE,
          details: omit(payload, ['password']),
        });
      });

      return SUCCESS_MESSAGES.CREATE_ENTITY('Admin');
    } catch (error) {
      const constraint = (error as PostgresError).constraint_name;
      switch (constraint) {
        case CONSTRAINT_NAME.ADMIN.USERNAME:
          return customError(409, ERROR_MESSAGES.DUPLICATE.USERNAME);

        case CONSTRAINT_NAME.ADMIN.EMAIL:
          return customError(409, ERROR_MESSAGES.DUPLICATE.EMAIL);
      }

      return customError(500, ERROR_MESSAGES.CREATE_ENTITY('ADMIN'));
    }
  }
}
