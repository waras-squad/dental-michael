import Elysia from 'elysia';
import { AdminService, DoctorService } from '@/services';
import jwt from '@elysiajs/jwt';
import { JWT_SECRET_MAPPING } from '@/const';
import { JwtName } from '@/enum';
import { AuthModels } from '@/middlewares';

export const authRoutes = new Elysia({
  prefix: '/auth',
  detail: {
    tags: ['Auth'],
    summary: 'Endpoits for authentication',
  },
})
  .use(AuthModels)
  .group('/admin', (app) => {
    return app
      .use(
        jwt({
          name: JwtName.ADMIN,
          secret: JWT_SECRET_MAPPING.adminJWT,
        })
      )
      .post(
        '/',
        async ({ body, adminJWT }) => {
          const admin = await AdminService.login(body);
          return { token: await adminJWT.sign(admin), admin };
        },
        {
          body: 'Auth-model',
          detail: {
            description: 'Login as an admin',
          },
        }
      );
  })
  .group('/doctor', (app) => {
    return app
      .use(
        jwt({
          name: JwtName.DOCTOR,
          secret: JWT_SECRET_MAPPING.doctorJWT,
        })
      )
      .post(
        '/',
        async ({ body, doctorJWT }) => {
          const doctor = await DoctorService.login(body);
          const token = await doctorJWT.sign(doctor);
          console.log(token);
          console.log(await doctorJWT.verify(token));

          return { token: await doctorJWT.sign(doctor), doctor };
        },
        {
          body: 'Auth-model',
          detail: {
            description: 'Login as a doctor',
          },
        }
      );
  });
