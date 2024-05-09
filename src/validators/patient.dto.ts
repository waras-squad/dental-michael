import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export const getPatientListFilterDTO = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ minLength: 1 })),
  phone: t.Optional(t.String({ minLength: 1 })),
  gender: t.Optional(
    t.Enum(Gender, {
      error: "Gender have to be either 'MALE' OR 'FEMALE'",
      description: "'MALE' or 'FEMALE'",
    })
  ),
  nik: t.Optional(t.String({ minLength: 1 })),
  created_by: t.Optional(t.String({ minLength: 1 })),
  is_deleted: t.Optional(
    t.BooleanString({ default: 'false', description: "'true' or 'false'" })
  ),
});

export type GetPatientListFilterDTO = Static<typeof getPatientListFilterDTO>;

export const createPatientDTO = t.Object({
  email: t.String({ format: 'email', error: 'Invalid email' }),
  password: t.String({ minLength: 5 }),
  name: t.String({ minLength: 1 }),
  phone: t.String({ minLength: 10 }),
  nik: t.String({ minLength: 16, maxLength: 16, error: 'Invalid NIK' }),
  gender: t.Enum(Gender, {
    error: "Gender have to be either 'MALE' OR 'FEMALE'",
  }),
  dob: t.String({ format: 'date' }),
  profile_picture: t.String({
    format: 'uri',
    examples: 'https://example.com',
    error: 'Invalid profile picture url typebox',
  }),
});
export type CreatePatientDTO = Static<typeof createPatientDTO>;

export const editPatientDTO = t.Partial(createPatientDTO);
export type EditPatientDTO = Static<typeof editPatientDTO>;

export const changePasswordDTO = t.Object({
  old_password: t.String({ minLength: 5 }),
  new_password: t.String({ minLength: 5 }),
});
export type ChangePasswordDTO = Static<typeof changePasswordDTO>;

export const uploadUserFileDTO = t.Object({
  files: t.Files(),
  type: t.Optional(t.String({ minLength: 1 })),
});
export type UploadUserFileDTO = Static<typeof uploadUserFileDTO>;
