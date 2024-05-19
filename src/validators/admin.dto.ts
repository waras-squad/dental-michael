import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export const createAdminDTO = t.Object({
  username: t.String({
    minLength: 5,
    maxLength: 255,
    error: 'Username minimum is 5 characters',
  }),
  password: t.String({
    minLength: 5,
    maxLength: 255,
    error: 'Password minimum is 5 characters',
  }),
  role: t.String({ minLength: 1, maxLength: 255 }),
  email: t.String({
    format: 'email',
    minLength: 1,
    maxLength: 255,
    error: 'Invalid email format',
  }),
  gender: t.Enum(Gender, {
    error: "Gender have to be either 'MALE' OR 'FEMALE'",
    description: "'MALE' or 'FEMALE'",
  }),
  dob: t.String({
    format: 'date',
    examples: '2000-01-01',
    error: 'DOB should be yyyy-MM-dd format',
  }),
});
export type CreateAdminDTO = Static<typeof createAdminDTO>;
