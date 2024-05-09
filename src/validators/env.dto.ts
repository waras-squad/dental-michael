const env = {
  NODE_ENV: Bun.env.NODE_ENV || 'development',
  PORT: Bun.env.PORT || 1000,
  DB_URL: Bun.env.DB_URL!,
  ADMIN_JWT_SECRET: Bun.env.ADMIN_JWT_SECRET!,
  USER_JWT_SECRET: Bun.env.USER_JWT_SECRET!,
  DOCTOR_JWT_SECRET: Bun.env.DOCTOR_JWT_SECRET!,
  AWS_BUCKET_ENDPOINT: Bun.env.AWS_BUCKET_ENDPOINT!,
  AWS_ACCESS_KEY: Bun.env.AWS_ACCESS_KEY!,
  AWS_SECRET_KEY: Bun.env.AWS_SECRET_KEY!,
  AWS_S3_BUCKET: Bun.env.AWS_S3_BUCKET!,
};

for (const key of Object.values(env)) {
  if (!key) {
    throw new Error(`Please set ${key} environment variable`);
  }
}

export default env;
