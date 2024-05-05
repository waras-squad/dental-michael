import { Static, t } from 'elysia';

export const validateAdminLogin = t.Object({
  username: t.String(),
  password: t.String({ minLength: 5 }),
});

export type ValidateAdminLogin = Static<typeof validateAdminLogin>;
