import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export async function getQrcode(qrcode: string) {
  const client = await db.connect();
  try {
    const results = await client.query(
      "SELECT EXTRACT(DAYS FROM (created_at - NOW())) AS age FROM qrcodes WHERE qrcode_string = $1",
      [qrcode]
    );
    const qrcodeResult = results.rows;
    return qrcodeResult;
  } finally {
    client.release();
  }
}

export async function postQrcode(employeeID: string, eventID: string) {
  const client = await db.connect();
  try {
    /// TODO; check if employee and event exists before doing anything
    await client.query("BEGIN;");
    await client.query(
      "UPDATE events_employees AS ee SET has_printed_qr = 'true' WHERE ee.employee_id = $1 AND ee.event_id = $2",
      [employeeID, eventID]
    );
    const results = await client.query(
      "INSERT INTO qrcodes DEFAULT VALUES RETURNING qrcode_string;"
    );
    await client.query("COMMIT;");
    const qrcodeResult = results.rows[0];
    return qrcodeResult;
  } finally {
    client.release();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const qrcode = req.query.qrcode;
    if (!Array.isArray(qrcode)) {
      if (!qrcode) {
        res
          .status(400)
          .send(
            "Get request for this route needs QRcode string as query parameter"
          );
      }
      const result = await getQrcode(qrcode);
      if (result.length === 0) {
        res.status(404).send("Qrcode does not exist on database");
      }
      res.send(result[0]);
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for QRcode string");
    }
  } else if (req.method === "POST") {
    const { employeeID, eventID } = JSON.parse(req.body);
    if (!Array.isArray(employeeID) && !Array.isArray(eventID)) {
      if (eventID && employeeID) {
        const result = await postQrcode(employeeID, eventID);
        res.send(result);
      } else {
        res
          .status(400)
          .send(
            "POST request for this route needs eventID and employeeID string as query parameter"
          );
      }
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for one of the IDs");
    }
  }
}

///a
