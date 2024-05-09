import Elysia from 'elysia';

import { AdminService } from '@/services';
import {
  changePasswordDTO,
  createPatientDTO,
  editPatientDTO,
  uploadUserFileDTO,
} from '@/validators';
import { JwtName } from '@/enum';
import { PatientService } from '@/services';
import { authMiddleware } from '@/middlewares';
import { UserFileService } from '@/services/userFile.service';

const AdminModels = new Elysia({ name: 'Model.Admin' }).model({
  'Create-patient': createPatientDTO,
  'Update-patient': editPatientDTO,
  'Change-patient-password': changePasswordDTO,
  'Upload-patient-file': uploadUserFileDTO,
});

export const adminRoutes = new Elysia({
  prefix: '/admin',
  detail: {
    tags: ['Admin'],
    security: [{ AdminAuth: [] }], //? Let all routes belongs to this group require admin authentication
  },
})
  .use(AdminModels)
  .use(authMiddleware(JwtName.ADMIN))
  .get('/', async () => AdminService.list(), {})
  .group('/patients', (app) =>
    app
      .get(
        '/',
        async () => {
          return await PatientService.getList();
        },
        {
          detail: {
            summary: 'Get all patients',
          },
        }
      )
      .get(
        '/:uuid',
        async ({ params }) => {
          const uuid = params.uuid;

          return await PatientService.findPatientByIdOrThrowError(uuid);
        },
        {
          detail: {
            summary: 'Get One Patient by UUID',
          },
        }
      )
      .post(
        '/',
        async ({ body, admin }) => {
          return await PatientService.create(body, admin);
        },
        {
          body: 'Create-patient',
          detail: {
            summary: 'Create new patient',
          },
        }
      )
      .post(
        '/:uuid/files',
        async ({ body, admin, params }) => {
          const user_id = params.uuid;
          return await UserFileService.uploadFile(user_id, body, admin);
        },
        {
          body: 'Upload-patient-file',
          detail: {
            summary: 'Upload files for specific patient',
          },
        }
      )
      .put(
        '/:uuid',
        async ({ params, body, admin }) => {
          const uuid = params.uuid;
          return await PatientService.update(uuid, body, admin);
        },
        {
          body: 'Update-patient',
          detail: {
            summary: 'Edit existing patient',
          },
        }
      )
      .patch(
        '/:uuid/password',
        async ({ params, body, admin }) => {
          const uuid = params.uuid;
          return await PatientService.changePassword(uuid, body, admin);
        },
        {
          body: 'Change-patient-password',
          detail: {
            summary: 'Change patient password',
          },
        }
      )
      .delete(
        '/:uuid',
        async ({ params, admin }) => {
          const uuid = params.uuid;
          return await PatientService.delete(uuid, admin);
        },
        {
          detail: {
            summary: 'Soft Delete patient',
          },
        }
      )
  );
