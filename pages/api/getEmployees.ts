import db from "../../lib/db";

export default async function getEmployees() {
  const client = await db.connect();
  const results = await client.query<employee>("SELECT * FROM employees");
  client.release();
  return results.rows;
}

///TODO: separate this function into handle and getData
