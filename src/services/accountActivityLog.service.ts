import { accountActivityLogs } from '@/db/schemas/accountActivityLog.schema';
import { AccountActivity, AccountType } from '@/enum';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

type Tx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import('@/db/schemas/index'),
  ExtractTablesWithRelations<typeof import('@/db/schemas/index')>
>;

export class AccountActivityLogService {
  static async insertToLog(
    tx: Tx,
    payload: {
      target_id: string;
      actor_id: string;
      action: AccountActivity;
      target_type: AccountType;
      actor_type: AccountType;
      details: Object;
    }
  ) {
    await tx.insert(accountActivityLogs).values(payload);
  }
}
