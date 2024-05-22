import { JwtName } from '@/enum';
import { authMiddleware, doctorModels } from '@/middlewares';
import { DoctorService } from '@/services';
import { BackgroundTypeKey } from '@/validators';
import Elysia from 'elysia';

export const doctorRoutes = new Elysia({
  prefix: '/doctor',
  detail: {
    tags: ['Doctor API'],
    security: [{ DoctorAuth: [] }], //? Let all routes belongs to this group require doctor authentication
  },
})
  .use(authMiddleware(JwtName.DOCTOR))
  .group(
    '/profile',
    {
      detail: {
        tags: ['Doctor Profile'],
      },
    },
    (app) => {
      return app
        .use(doctorModels)
        .get(
          '/',
          ({ doctor }) => {
            if (doctor)
              return DoctorService.findDoctorByIdWithBackground(doctor.id);
          },
          {
            detail: {
              summary:
                'Get a complete profile except password, bacgkround, schedules, and treatment',
            },
          }
        )
        .put(
          '/',
          ({ body, doctor }) => {
            if (doctor) return DoctorService.update(doctor.id, body);
          },
          {
            body: 'Update-doctor',
            detail: {
              summary: 'Update doctor profile',
            },
          }
        )
        .put(
          `/${BackgroundTypeKey.ACADEMIC}`,
          ({ doctor, body }) => {
            if (doctor)
              return DoctorService.createOrUpdateBackground(
                doctor.id,
                BackgroundTypeKey.ACADEMIC,
                body
              );
          },
          {
            body: 'Modify-academics',
            detail: {
              summary: 'Modify doctor academic background',
            },
          }
        )
        .put(
          `/${BackgroundTypeKey.ACHIEVEMENT}`,
          ({ doctor, body }) => {
            if (doctor)
              return DoctorService.createOrUpdateBackground(
                doctor.id,
                BackgroundTypeKey.ACHIEVEMENT,
                body
              );
          },
          {
            body: 'Modify-achievements',
            detail: {
              summary: 'Modify doctor achievements',
            },
          }
        )
        .put(
          `/${BackgroundTypeKey.CERTIFICATION}`,
          ({ doctor, body }) => {
            if (doctor)
              return DoctorService.createOrUpdateBackground(
                doctor.id,
                BackgroundTypeKey.CERTIFICATION,
                body
              );
          },
          {
            body: 'Modify-certificates',
            detail: {
              summary: 'Modify doctor certificates',
            },
          }
        )
        .put(
          `/${BackgroundTypeKey.EXPERIENCE}`,
          ({ doctor, body }) => {
            if (doctor)
              return DoctorService.createOrUpdateBackground(
                doctor.id,
                BackgroundTypeKey.EXPERIENCE,
                body
              );
          },
          {
            body: 'Modify-experiences',
            detail: {
              summary: 'Modify doctor experiences',
            },
          }
        )
        .put(
          '/schedules',
          ({ doctor, body }) => {
            if (doctor) return DoctorService.updateSchedules(doctor.id, body);
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
          '/treatments',
          ({ doctor, body }) => {
            if (doctor) return DoctorService.modifyTreatments(doctor.id, body);
          },
          {
            detail: {
              summary: 'Modify doctor treatments',
              description:
                'if ID is provided, it will be edited, otherwise it will be created, the exsiting will be deleted',
            },
            body: 'Modify-treatments',
          }
        );
    }
  );
