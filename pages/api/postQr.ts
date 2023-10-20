import db from "../../lib/db";

export async function postQr(employee_id: string, event_id: string) {
  const client = await db.connect();
  try {
    /// TODO; check if employee and event exists before doing anything
    await client.query("BEGIN;");
    await client.query(
      "UPDATE events_employees AS ee SET has_printed_qr = 'true' WHERE ee.employee_id = $1 AND ee.event_id = $2",
      [employee_id, event_id]
    );
    const results = await client.query(
      "INSERT INTO qrcodes DEFAULT VALUES RETURNING qrcode_string;"
    );
    await client.query("COMMIT;");
    return results.rows;
  } finally {
    client.release();
  }
}
