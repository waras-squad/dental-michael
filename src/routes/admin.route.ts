import Elysia from 'elysia';

import { AdminService } from '@/services';
import {
  changePasswordDTO,
  createAdminDTO,
  createPatientDTO,
  editPatientDTO,
  getPatientListFilterDTO,
  uploadUserFileDTO,
} from '@/validators';
import { JwtName } from '@/enum';
import { PatientService } from '@/services';
import { authMiddleware } from '@/middlewares';
import { UserFileService } from '@/services/userFile.service';
import { getAllPatientFilterSwaggerParameter } from '@/utils';
import { createDoctorDTO, updateDoctorDTO } from '@/validators/doctor.dto';
import { DoctorService } from '@/services/doctor.service';

const generalModels = new Elysia({ name: 'Model.General' }).model({
  'Change-password': changePasswordDTO,
});

const patientModels = new Elysia({ name: 'Model.Admin.Patient' }).model({
  'Get-patient-filter': getPatientListFilterDTO,
  'Create-patient': createPatientDTO,
  'Update-patient': editPatientDTO,
  'Upload-patient-file': uploadUserFileDTO,
});

const doctorModels = new Elysia({ name: 'Mode.Admin.Doctor' }).model({
  'Create-doctor': createDoctorDTO,
  'Update-doctor': updateDoctorDTO,
});

const adminModels = new Elysia({ name: 'Model.Admin.Admin' }).model({
  'Create-Admin': createAdminDTO,
});

export const adminRoutes = new Elysia({
  prefix: '/admin',
  detail: {
    security: [{ AdminAuth: [] }], //? Let all routes belongs to this group require admin authentication
  },
})
  .use(authMiddleware(JwtName.ADMIN))
  .use(generalModels)
  .group(
    '/patients',
    {
      detail: {
        tags: ['Admin - Patient'],
      },
    },
    (app) =>
      app
        .use(patientModels)
        .get(
          '/',
          async ({ query }) => {
            return await PatientService.getList(query);
          },
          {
            query: 'Get-patient-filter',
            detail: {
              summary: 'Get all patients',
              parameters: getAllPatientFilterSwaggerParameter,
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
            body: 'Change-password',
            detail: {
              summary: 'Change patient password',
            },
          }
        )
        .patch(
          '/:uuid/reactivate',
          async ({ params: { uuid }, admin }) => {
            if (admin) return await PatientService.reactivate(uuid, admin);
          },
          {
            detail: {
              summary: 'Reactivate patient',
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
  )
  .group(
    '/doctors',
    {
      detail: {
        tags: ['Admin - Doctor'],
      },
    },
    (app) =>
      app
        .use(doctorModels)
        .get(
          '/:uuid',
          async ({ params: { uuid } }) => {
            return await DoctorService.findDoctorById(uuid);
          },
          {
            detail: {
              summary: 'Get doctor detail by UUID',
            },
          }
        )
        .post(
          '/',
          async ({ body, admin }) => {
            if (admin) return await DoctorService.create(body, admin);
          },
          {
            body: 'Create-doctor',
            detail: {
              summary: 'Create new doctor',
            },
          }
        )
        .put(
          '/:uuid',
          async ({ params: { uuid }, body, admin }) => {
            if (admin) return await DoctorService.update(uuid, body, admin);
          },
          {
            body: 'Update-doctor',
            detail: {
              summary: 'Edit existing doctor',
            },
          }
        )
        .delete(
          '/:uuid',
          async ({ params: { uuid }, admin }) => {
            if (admin) return await DoctorService.delete(uuid, admin);
          },
          {
            detail: {
              summary: 'Soft delete / deactivate doctor',
            },
          }
        )
        .patch(
          '/:uuid/password',
          async ({ params: { uuid }, body, admin }) => {
            if (admin)
              return await DoctorService.changePassword(uuid, body, admin);
          },
          {
            body: 'Change-password',
            detail: {
              summary: "Change a doctor's password",
            },
          }
        )
        .patch(
          '/:uuid/reactivate',
          async ({ params: { uuid }, admin }) => {
            if (admin) return await DoctorService.reactivate(uuid, admin);
          },
          {
            detail: {
              summary: 'Reactivate a doctor',
            },
          }
        )
  )
  .use(adminModels)
  .get('/', async () => AdminService.list(), {})
  .post(
    '/',
    async ({ admin, body }) => {
      if (admin) {
        return AdminService.create(body, admin);
      }
    },
    {
      body: 'Create-Admin',
      detail: {
        summary: 'Create new admin',
      },
    }
  );
