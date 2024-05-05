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
