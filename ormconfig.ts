import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/**/*.{entity,repository}{.ts,.js}`],
  synchronize: false,
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'TypeormMigrations',
  migrationsRun: true,
};

export const AppDataSource = new DataSource(databaseConfig);
