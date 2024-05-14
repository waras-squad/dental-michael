import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export const validateDoctorLogin = t.Object({
  username: t.String(),
  password: t.String({ minLength: 5 }),
});
export type ValidateDoctorLogin = Static<typeof validateDoctorLogin>;

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
