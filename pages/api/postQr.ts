import db from "../../lib/db";

export async function postQr(employee_id: string, event_id: string) {
  const client = await db.connect();
  const results = await client.query<event>(
    "BEGIN; UPDATE events_employees AS ee SET has_printed_qr = 'true' WHERE ee.employee_id = $1 AND ee.event_id = $2; INSERT INTO qrcodes(number) VALUES (1) RETURNING string; COMMIT",
    [employee_id, event_id]
  );
  client.release();
  return results.rows;
}
