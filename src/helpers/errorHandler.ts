import { error } from 'elysia';

export const customError = (status: number, message: string) => {
  console.log('this error');
  throw error(status, {
    status,
    message,
  });
};
