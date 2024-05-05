import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export const createPatientDTO = t.Object({
  email: t.String({ format: 'email', error: 'Invalid email' }),
  password: t.String({ minLength: 5 }),
  name: t.String({ minLength: 1 }),
  phone: t.String(),
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
