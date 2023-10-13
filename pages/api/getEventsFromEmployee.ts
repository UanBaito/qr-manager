import db from "../../lib/db";

export default async function getEventsFromEmployee(id: string) {
  const client = await db.connect();
  const results = await client.query<event>(
    "SELECT events.id, events.name, events_employees.has_printed_qr FROM events_employees, events WHERE events_employees.event_id = events.id AND events_employees.employee_id = $1",
    [id]
  );
  client.release();
  return results.rows;
}
