import db from "../../lib/db";

export default async function getEmployee(id: string) {
  const client = await db.connect();
  const results = await client.query<employee>(
    "SELECT * FROM employees WHERE id = $1",
    [id]
  );
  client.release();
  return results.rows;
}
