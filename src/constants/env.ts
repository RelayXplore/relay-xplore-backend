import 'dotenv/config';

const { NODE_ENV } = process.env;

export const env = {
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,

  SIGNATURE_GUARD_TIMEOUT_SECONDS:
    Number(process.env.SIGNATURE_GUARD_TIMEOUT_SECONDS) || 120,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_IN: process.env.JWT_EXPIRATION_IN || '1d',

  isProduction: NODE_ENV === 'production',

  isTestnet: NODE_ENV === 'testnet',

  isStaging: NODE_ENV === 'staging',

  isDevelopment: NODE_ENV === 'development',
};
