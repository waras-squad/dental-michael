import { fullCreateAdminDTO } from '@/db/schemas';
import { Static, t } from 'elysia';

export const validateAdminLogin = t.Object({
  username: t.String(),
  password: t.String({ minLength: 5 }),
});
export type ValidateAdminLogin = Static<typeof validateAdminLogin>;

export const createAdminDTO = t.Omit(fullCreateAdminDTO, [
  'id',
  'created_at',
  'updated_at',
]);
export type CreateAdminDTO = Static<typeof createAdminDTO>;
