import { AccountActivity, AccountType, Gender } from '@/enum';
import { enumToPgEnum } from '@/helpers';
import { pgEnum } from 'drizzle-orm/pg-core';

export const genderEnum = pgEnum('gender', enumToPgEnum(Gender));
export const logActivityEnum = pgEnum('action', enumToPgEnum(AccountActivity));
export const accountTypeEnum = pgEnum('role', enumToPgEnum(AccountType));
