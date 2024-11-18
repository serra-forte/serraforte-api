import { Pool } from 'pg';
import 'dotenv/config';
import { env } from '@/env';

export const connectionPg = new Pool({
  connectionString: JSON.parse(env.DATABASE_URL)
});
