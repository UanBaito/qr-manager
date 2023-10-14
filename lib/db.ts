import { Pool } from "pg";
import "dotenv/config";

const db = new Pool({ connectionString: process.env.PGURL });

export default db;
