import { Static, t } from 'elysia';

export type PostgresError = {
  name: string;
  severity_local: string;
  severity: string;
  code: string;
  detail: string;
  schema_name: string;
  table_name: string;
  constraint_name: string;
  file: string;
  originalLine: number;
  originalColumn: number;
  routine: string;
};

export const changePasswordDTO = t.Object({
  old_password: t.String({ minLength: 5 }),
  new_password: t.String({ minLength: 5 }),
});
export type ChangePasswordDTO = Static<typeof changePasswordDTO>;

export const validateLogin = t.Object({
  username: t.String({ minLength: 1 }),
  password: t.String({ minLength: 5 }),
});
export type ValidateLogin = Static<typeof validateLogin>;
