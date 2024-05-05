import Elysia from 'elysia';
import { AdminService } from '@/services';
import jwt from '@elysiajs/jwt';
import { validateAdminLogin } from '@/validators';

const AuthModels = new Elysia({ name: 'Model.Auth' }).model({
  'Admin-auth': validateAdminLogin,
});

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(AuthModels)
  .use(
    jwt({
      name: 'adminJWT',
      secret: Bun.env.ADMIN_JWT_SECRET!,
    })
  )
  .group(
    '/auth',
    {
      detail: {
        tags: ['Auth'],
        summary: 'Endpoits for authentication',
      },
    },
    (app) => {
      return app.post(
        '/admin',
        async ({ body, adminJWT }) => {
          const admin = await AdminService.login(body);
          return { token: await adminJWT.sign(admin), admin };
        },
        {
          body: 'Admin-auth',
          detail: {
            description: 'Login as an admin',
          },
        }
      );
    }
  );
