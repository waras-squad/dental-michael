import { error } from 'elysia';

export const customError = (status: number, message: string) => {
  throw error(status, {
    status,
    message,
  });
};
