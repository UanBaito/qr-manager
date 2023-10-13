import db from "../../lib/db";

export default async function getEvents() {
  const client = await db.connect();
  const results = await client.query<event>("SELECT * FROM events");
  client.release();
  console.log(results);
  results.rows.forEach((event) => {
    event.created_at = JSON.parse(JSON.stringify(event.created_at));
    console.log(event.created_at);
  });

  return results.rows;
}
