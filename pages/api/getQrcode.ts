import db from "../../lib/db";

export async function getQrcode(qrcode: string) {
  const client = await db.connect();
  const results = await client.query(
    "SELECT EXTRACT(DAYS FROM (created_at - NOW())) AS age FROM qrcodes WHERE qrcode_string = $1",
    [qrcode]
  );
  client.release();
  const qrcodeResult = results.rows[0];
  return qrcodeResult;
}
