import { pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema';
import { InferSelectModel, relations } from 'drizzle-orm';

export const userFiles = pgTable('user_files', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => patients.id),
  type: varchar('type'),
  path: varchar('path'),
  name: varchar('name'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const filesRelations = relations(userFiles, ({ one }) => ({
  patient: one(patients, {
    fields: [userFiles.user_id],
    references: [patients.id],
  }),
}));

export type UserFile = InferSelectModel<typeof userFiles>;
