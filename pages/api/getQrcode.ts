import db from "../../lib/db";

export async function getQrcode(qrcode: string) {
  const client = await db.connect();
  const results = await client.query("SELECT * FROM qrcode WHERE id = $1", [
    qrcode,
  ]);
  client.release();
  return results.rows;
}
