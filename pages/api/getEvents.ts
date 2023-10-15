import db from "../../lib/db";

export default async function getEvents() {
  const client = await db.connect();
  const results = await client.query<event>("SELECT * FROM events");
  client.release();

  results.rows.forEach((event) => {
    event.created_at = JSON.parse(JSON.stringify(event.created_at));
  });

  return results.rows;
}
