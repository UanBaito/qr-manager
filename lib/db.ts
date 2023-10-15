import { Pool } from "pg";
import "dotenv/config";

let url = null;

if (process.env.ENVIRONMENT === "PRODUCTION") {
  url = process.env.PGURL;
}

const db = new Pool({ connectionString: url });

export default db;
