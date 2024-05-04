import Elysia from 'elysia';
import { AdminService } from '@/services';
import jwt from '@elysiajs/jwt';
import { validateAdminLogin } from '@/validators';

export const adminRoutes = new Elysia().group('/admin', (app) => {
  return app
    .use(
      jwt({
        name: 'adminJWT',
        secret: Bun.env.ADMIN_JWT_SECRET!,
      })
    )
    .get('/', async ({}) => AdminService.list())
    .post(
      '/login',
      async ({ body, adminJWT }) => {
        const admin = await AdminService.login(body);
        return { token: await adminJWT.sign(admin), admin };
      },
      {
        body: validateAdminLogin,
      }
    );
});
