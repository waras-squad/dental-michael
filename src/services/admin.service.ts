import { customError } from '@/helpers/errorHandler';
import { ValidateAdminLogin } from '@/validators';
import { db } from '@/db';

export class AdminService {
  static async list() {
    // return await db
    //   .select({
    //     id: admins.id,
    //     username: admins.username,
    //   })
    //   .from(admins)
    //   .execute();

    return await db.query.admins.findMany();
  }

  static async login(payload: ValidateAdminLogin) {
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
}
