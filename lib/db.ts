import { Pool } from "pg";
import "dotenv/config";

let url = null;

if (process.env.NODE_ENV === "production") {
  url = process.env.PGURL;
}

const db = new Pool({ connectionString: url });

export default db;
