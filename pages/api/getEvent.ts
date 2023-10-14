import db from "../../lib/db";

export default async function getEvent(id: string) {
  const client = await db.connect();
  const results = await client.query<event>(
    "SELECT * FROM events WHERE id = $1",
    [id]
  );
  client.release();
  results.rows.forEach((event) => {
    event.created_at = JSON.parse(JSON.stringify(event.created_at));
  });
  return results.rows;
}
