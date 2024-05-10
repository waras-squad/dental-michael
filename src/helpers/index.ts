import { error, t } from 'elysia';

// Takes an enum and return an array with each values
export function enumToPgEnum(
  myEnum: Record<string, string>
): [string, ...string[]] {
  return Object.values(myEnum).map((value) => `${value}`) as [
    string,
    ...string[]
  ];
}

export const customError = (status: number, message: string) => {
  throw error(status, {
    status,
    message,
  });
};

export const formatPhone = (phone: string) => {
  if (phone.startsWith('0')) {
    return `+62${phone.substring(1)}`;
  }
  if (phone.startsWith('62')) {
    return `+${phone}`;
  }

  return phone;
};

export const omit = <T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
) => {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }

  return clone;
};
