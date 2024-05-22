import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export const createDoctorDTO = t.Object({
  username: t.String({ minLength: 5, error: 'username minimal 5 characters' }),
  password: t.String({ minLength: 5, error: 'password minimal 5 characters' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  name: t.String({ minLength: 1, error: 'Name is required' }),
  gender: t.Enum(Gender, {
    error: "Gender must be either 'MALE' or 'FEMALE'",
    description: "'MALE' or 'FEMALE'",
  }),
  phone: t.RegExp('^(\\+62|62|0)8[1-9][0-9]{6,9}$', {
    error: 'Phone must be indonesian format',
    minLength: 9,
  }),
  dob: t.String({
    format: 'date',
    examples: '2000-01-01',
    error: 'DOB should be yyyy-MM-dd format',
  }),
  address: t.String(),
  nik: t.Optional(
    t.RegExp('^\\d{16}$', {
      error: 'Invalid NIK',
      examples: '3174043101963456',
      description: '16 digit NIK',
    })
  ),
  profile_picture: t.File({ error: 'Profile picture must be image' }),
  tax: t.Optional(t.Numeric({ error: 'Invalid tax format' })),
  is_active: t.Optional(t.Boolean()),
});
export type CreateDoctorDTO = Static<typeof createDoctorDTO>;

export const updateDoctorDTO = t.Partial(
  t.Composite([
    t.Omit(createDoctorDTO, ['password', 'is_active', 'profile_picture']),
    t.Object({
      profile_picture: t.Union([t.File(), t.String()]),
    }),
  ])
);
export type UpdateDoctorDTO = Static<typeof updateDoctorDTO>;

export const academicDTO = t.Array(
  t.Object({
    id: t.Optional(t.Number()),
    degree_title: t.String(),
    institution: t.String(),
    year: t.Number(),
  })
);

export type AcademicDTO = Static<typeof academicDTO>;

export const experienceDTO = t.Array(
  t.Object({
    id: t.Optional(t.Number()),
    title: t.String(),
    company: t.String(),
    description: t.Optional(t.String()),
    start_date: t.String({
      format: 'date',
      examples: '2000-01-01',
      error: 'Start date should be yyyy-MM-dd format',
    }),
    end_date: t.String({
      format: 'date',
      examples: '2000-01-01',
      error: 'End date should be yyyy-MM-dd format',
    }),
    is_current: t.Optional(t.Boolean({ default: false })),
  })
);

export type ExperiencesDTO = Static<typeof experienceDTO>;

export const certificateDTO = t.Array(
  t.Object({
    id: t.Optional(t.Number()),
    title: t.String(),
    issuer: t.String(),
    year_obtained: t.Number(),
  })
);

export type CertificationsDTO = Static<typeof certificateDTO>;

export const achievementDTO = t.Array(
  t.Object({
    id: t.Optional(t.Number()),
    title: t.String(),
    description: t.String(),
    year: t.Number(),
  })
);

export type AchievementDTO = Static<typeof achievementDTO>;

export enum BackgroundTypeKey {
  ACADEMIC = 'academics',
  EXPERIENCE = 'experiences',
  CERTIFICATION = 'certifications',
  ACHIEVEMENT = 'achievements',
}
export type BackgroundType = {
  academics: AcademicDTO;
  experiences: ExperiencesDTO;
  certifications: CertificationsDTO;
  achievements: AchievementDTO;
};

export const doctorScheduleDTO = t.Array(
  t.Object({
    id: t.Number(),
    start_at: t.String(),
    end_at: t.String(),
    is_close: t.Optional(t.Boolean({ default: false })),
  }),
  {
    maxItems: 7,
  }
);
export type DoctorScheduleDTO = Static<typeof doctorScheduleDTO>;

export const doctorTreatmentDTO = t.Array(
  t.Object({
    id: t.Optional(t.Number()),
    name: t.String(),
    price: t.Optional(t.Number()),
    duration: t.Number(),
    duration_type: t.String(),
    is_active: t.Optional(t.Boolean({ default: true })),
  })
);
export type DoctorTreatmentDTO = Static<typeof doctorTreatmentDTO>;

export enum GetDoctorSortBy {
  CREATED_AT = 'created_at',
  CREATED_AT_DESC = '-created_at',
  NAME = 'name',
  NAME_DESC = '-name',
  EMAIL = 'email',
  EMAIL_DESC = '-email',
  PHONE = 'phone',
  PHONE_DESC = '-phone',
  NIK = 'nik',
  NIK_DESC = '-nik',
  USERNAME = 'username',
  USERNAME_DESC = '-username',
  UPDATED_AT = 'updated_at',
  UPDATED_AT_DESC = '-updated_at',
  DOB = 'dob',
  DOB_DESC = '-dob',
  CREATED_BY = 'created_by',
  CREATED_BY_DESC = '-created_by',
}

export const getDoctorListFilterDTO = t.Partial(
  t.Object({
    page: t.Optional(
      t.RegExp('^[1-9][0-9]*$', {
        error: 'page can only be integer start from 1',
        default: '1',
      })
    ),
    limit: t.RegExp('^[1-9][0-9]*$', {
      error: 'page can only be integer start from 1',
      default: '10',
    }),
    sort: t.Optional(
      t.Enum(GetDoctorSortBy, { default: GetDoctorSortBy.CREATED_AT_DESC })
    ),
    username: t.String({ minLength: 1 }),
    name: t.String({ minLength: 1 }),
    email: t.String({ minLength: 1 }),
    gender: t.Enum(Gender, {
      error: "Gender must be either 'MALE' or 'FEMALE'",
      description: "'MALE' or 'FEMALE'",
    }),
    dob: t.String({
      format: 'date',
      examples: '2000-01-01',
      error: 'DOB should be yyyy-MM-dd format',
    }),
    phone: t.String({ minLength: 1 }),
    nik: t.String({ minLength: 1, maxLength: 16 }),
    is_active: t.BooleanString(),
    created_by: t.String({ minLength: 1 }),
  })
);
export type GetDoctorListFilterDTO = Static<typeof getDoctorListFilterDTO>;
