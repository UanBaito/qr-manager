import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import format from "pg-format";
import { to as copyTo } from "pg-copy-streams";
import fs from "fs";
import fsAsync from "fs/promises";
import path from "path";
import { pipeline } from "node:stream/promises";

export async function getQrcode(
  qrcode: string,
  eventID?: string,
  employeeID?: string
) {
  if (eventID && employeeID) {
    const client = await db.connect();
    try {
      const results = await client.query(
        "SELECT qrcode_string FROM qrcodes WHERE event_id = $1 AND employee_id = $2",
        [eventID, employeeID]
      );
      const qrcodeResult = results.rows;

      return qrcodeResult;
    } finally {
      client.release();
    }
  } else if (eventID) {
    const client = await db.connect();
    try {
      const eventNameResult = await client.query(
        "SELECT name FROM events WHERE id = $1",
        [eventID]
      );
      const eventName = eventNameResult.rows[0].name;
      const stream = client.query(
        copyTo("COPY qrcodes(qrcode_string) TO STDOUT")
      );
      return { stream, eventName };
    } finally {
      client.release();
    }
  } else if (qrcode) {
    ///send individual qrCode
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
    await client.query("COMMIT;");
  } finally {
    client.release();
  }
}

export async function putQrcode(eventID: string) {
  const client = await db.connect();
  try {
    await client.query("BEGIN;");

    const ids = await client.query(
      "SELECT employee_id FROM events_employees WHERE event_id = $1",
      [eventID]
    );

    const mappedIds = ids.rows.map((employee_id) => [
      eventID,
      employee_id.employee_id,
    ]);

    await client.query(
      format(
        "INSERT INTO qrcodes(event_id, employee_id) VALUES %L ON CONFLICT DO NOTHING;",
        mappedIds
      )
    );
    await client.query(
      "UPDATE events_employees SET has_generated_qr = 'true' WHERE event_id = $1",
      [eventID]
    );

    await client.query("COMMIT;");
  } finally {
    client.release();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { employeeID, eventID, qrcode } = req.query;
    if (
      !Array.isArray(qrcode) &&
      !Array.isArray(eventID) &&
      !Array.isArray(employeeID)
    ) {
      let result;
      if (eventID) {
        try {
          result = await getQrcode(qrcode, eventID);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=${result.eventName}-qrcodes.csv`
          );
          res.setHeader("Content-Type", "text/csv");
          await pipeline(result.stream, res);
        } catch (err) {
          console.log(err);
          res.status(500).send("Something went wrong");
        }
      } else if (qrcode) {
        result = await getQrcode(qrcode);
        if (result.length === 0) {
          res.status(404).send("Qrcode does not exist on database");
        }
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
        await postQrcode(employeeID, eventID);
        res.send("Ok");
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
  } else if (req.method === "PUT") {
    const { eventID } = JSON.parse(req.body);
    if (!Array.isArray(eventID)) {
      if (eventID) {
        try {
          await putQrcode(eventID);
          res.send("QRcodes generated");
        } catch (error) {
          console.log(error);
          res.status(500).send("Something went wrong");
        }
      }
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for the ID");
    }
  }
}
