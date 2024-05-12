import { Gender } from '@/enum';
import { Static, t } from 'elysia';

export enum GetPatientSortBy {
  NAME = 'name',
  NAME_DESC = '-name',
  EMAIL = 'email',
  EMAIL_DESC = '-email',
  PHONE = 'phone',
  PHONE_DESC = '-phone',
  NIK = 'nik',
  NIK_DESC = '-nik',
  CREATED_AT = 'created_at',
  CREATED_AT_DESC = '-created_at',
  UPDATED_AT = 'updated_at',
  UPDATED_AT_DESC = '-updated_at',
}

export const getPatientListFilterDTO = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ minLength: 1 })),
  phone: t.Optional(t.String({ minLength: 1 })),
  gender: t.Optional(
    t.Enum(Gender, {
      error: "Gender have to be either 'MALE' OR 'FEMALE'",
    })
  ),
  nik: t.RegExp('^d{16}$', { error: 'Invalid NIK' }),
  created_by: t.Optional(t.String({ minLength: 1 })),
  is_deleted: t.Optional(t.BooleanString({ default: 'false' })),
  page: t.Optional(
    t.RegExp('^[1-9][0-9]*$', {
      error: 'page can only be integer start from 1',
      default: '1',
    })
  ),
  limit: t.Optional(
    t.RegExp('^[1-9][0-9]*$', {
      error: 'lpage can only be integer start from 1',
      default: '10',
    })
  ),
  sort: t.Optional(
    t.Enum(GetPatientSortBy, { default: GetPatientSortBy.CREATED_AT })
  ),
});

export type GetPatientListFilterDTO = Static<typeof getPatientListFilterDTO>;

export const createPatientDTO = t.Object({
  email: t.String({ format: 'email', error: 'Invalid email' }),
  password: t.String({ minLength: 5 }),
  name: t.String({ minLength: 1 }),
  phone: t.RegExp('^(\\+62|62|0)8[1-9][0-9]{6,9}$', {
    error: 'Phone must be indonesian format',
    minLength: 9,
  }),
  nik: t.String({ minLength: 16, maxLength: 16, error: 'Invalid NIK' }),
  gender: t.Enum(Gender, {
    error: "Gender have to be either 'MALE' OR 'FEMALE'",
  }),
  dob: t.String({ format: 'date' }),
  profile_picture: t.Optional(
    t.File({ error: 'Invalid profile_picture file format' })
  ),
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
