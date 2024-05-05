import { JWT_SECRET_MAPPING } from '@/const';
import { JwtName } from '@/enum';
import { customError } from '@/helpers';
import { AdminService, PatientService } from '@/services';
import jwt from '@elysiajs/jwt';
import Elysia, { t } from 'elysia';

const authenticationError = () => customError(401, 'Unauthorized');

export const authMiddleware = (type: JwtName) => (app: Elysia) => {
  return app
    .use(
      jwt({
        name: type,
        schema: t.Object({
          id: t.String(),
        }),
        secret: JWT_SECRET_MAPPING[type],
      })
    )
    .derive(async ({ adminJWT, doctorJWT, userJWT, request }) => {
      const jwt = adminJWT || doctorJWT || userJWT;

      const token = request.headers.get('Authorization')?.split(' ')[1];

      if (!token) {
        return authenticationError();
      }

      const payload = await jwt.verify(token);

      if (!payload) {
        return authenticationError();
      }

      switch (type) {
        case JwtName.ADMIN:
          const admin = await AdminService.findAdminById(payload.id);

          if (!admin) {
            return authenticationError();
          }

          return { admin };

        case JwtName.USER:
          const user = await PatientService.findPatientById(payload.id);

          if (!user) {
            return authenticationError();
          }

          return { user };

        case JwtName.DOCTOR:
          return {
            doctor: {
              id: 'uuid',
            },
          };
      }
    });
};
