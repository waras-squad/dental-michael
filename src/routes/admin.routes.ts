import Elysia from 'elysia';

import {
  AdminService,
  DoctorService,
  PatientService,
  UserFileService,
} from '@/services';

import {
  BackgroundTypeKey,
  createPatientDTO,
  editPatientDTO,
  getPatientListFilterDTO,
  uploadUserFileDTO,
} from '@/validators';

import { JwtName } from '@/enum';
import {
  adminModels,
  authMiddleware,
  doctorModels,
  generalModels,
} from '@/middlewares';
import {
  getAllDoctorFilterSwaggerParameter,
  getAllPatientFilterSwaggerParameter,
} from '@/utils';

const patientModels = new Elysia({ name: 'Model.Admin.Patient' }).model({
  'Get-patient-filter': getPatientListFilterDTO,
  'Create-patient': createPatientDTO,
  'Update-patient': editPatientDTO,
  'Upload-patient-file': uploadUserFileDTO,
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
        .get('/', ({ query }) => DoctorService.getList(query), {
          query: 'Get-doctor-filter',
          detail: {
            summary: 'Get all doctors with pagination',
            parameters: getAllDoctorFilterSwaggerParameter,
          },
        })
        .get(
          '/:uuid',
          async ({ params: { uuid } }) => {
            return await DoctorService.findDoctorByIdWithBackground(uuid);
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
        .put(
          `/:uuid/${BackgroundTypeKey.ACADEMIC}`,
          async ({ params: { uuid }, body, admin }) => {
            if (admin)
              return await DoctorService.createOrUpdateBackground(
                uuid,
                BackgroundTypeKey.ACADEMIC,
                body,
                admin
              );
          },
          {
            detail: {
              summary: 'Create or update doctor academics',
              description:
                'if id is provided, it will be editted, otherwise it will be created',
            },
            body: 'Modify-academics',
          }
        )
        .put(
          `/:uuid/${BackgroundTypeKey.ACHIEVEMENT}`,
          async ({ params: { uuid }, body, admin }) => {
            if (admin)
              return await DoctorService.createOrUpdateBackground(
                uuid,
                BackgroundTypeKey.ACHIEVEMENT,
                body,
                admin
              );
          },
          {
            detail: {
              summary: 'Create or update doctor achievements',
              description:
                'if id is provided, it will be editted, otherwise it will be created',
            },
            body: 'Modify-achievements',
          }
        )
        .put(
          `/:uuid/${BackgroundTypeKey.CERTIFICATION}`,
          async ({ params: { uuid }, body, admin }) => {
            if (admin)
              return await DoctorService.createOrUpdateBackground(
                uuid,
                BackgroundTypeKey.CERTIFICATION,
                body,
                admin
              );
          },
          {
            detail: {
              summary: 'Create or update doctor certifications',
              description:
                'if id is provided, it will be editted, otherwise it will be created',
            },
            body: 'Modify-certificates',
          }
        )
        .put(
          `/:uuid/${BackgroundTypeKey.EXPERIENCE}`,
          async ({ params: { uuid }, body, admin }) => {
            if (admin)
              return await DoctorService.createOrUpdateBackground(
                uuid,
                BackgroundTypeKey.EXPERIENCE,
                body,
                admin
              );
          },
          {
            detail: {
              summary: 'Create or update doctor experiences',
              description:
                'if id is provided, it will be editted, otherwise it will be created, the exsiting will be deleted',
            },
            body: 'Modify-experiences',
          }
        )
        .put(
          '/:uuid/schedules',
          ({ params: { uuid }, body, admin }) => {
            if (admin) return DoctorService.updateSchedules(uuid, body, admin);
          },
          {
            detail: {
              summary: 'Modify doctor schedules',
              description:
                'The schedules will be updated by id, and time format should be HH:mm',
            },
            body: 'Modify-schedules',
          }
        )
        .put(
          '/:uuid/treatments',
          ({ params: { uuid }, body, admin }) => {
            if (admin) return DoctorService.modifyTreatments(uuid, body, admin);
          },
          {
            detail: {
              summary: 'Modify doctor treatments',
              description:
                'if ID is provided, it will be edited, otherwise it will be created, the exsiting will be deleted',
            },
            body: 'Modify-treatments',
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
