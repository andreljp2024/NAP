import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Usamos a string de conexão padrão do nosso Docker caso não exista no .env
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:nap_secure_pwd@localhost:5432/nap_crm';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
