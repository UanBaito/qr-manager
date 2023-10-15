import db from "../../lib/db";

export default async function getEmployeesFromEvent(id: string) {
  const client = await db.connect();
  const results = await client.query<event>(
    "SELECT employees.id, employees.name, events_employees.has_printed_qr FROM employees, events_employees WHERE events_employees.event_id = $1 AND events_employees.employee_id = employees.id",
    [id]
  );
  /// console.log(results.rows);
  client.release();
  return results.rows;
}
