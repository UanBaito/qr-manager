import db from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import format from "pg-format";

export async function getEvent(eventID?: string, employeeID?: string) {
  let query = "";
  if (eventID) {
    /// send especific event
    query = format("SELECT * FROM events WHERE id = '%s'", eventID);
  } else if (employeeID) {
    /// send events from employee
    query = format(
      "SELECT events.id, events.name, events_employees.has_printed_qr FROM events_employees, events WHERE events_employees.event_id = events.id AND events_employees.employee_id = '%s' ORDER BY name DESC",
      employeeID
    );
  } else {
    ///send all events
    query = "SELECT * FROM events";
  }

  const client = await db.connect();
  const results = await client.query(query);
  client.release();
  return results.rows;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { eventID, employeeID } = req.query;
    if (!Array.isArray(eventID) && !Array.isArray(employeeID)) {
      if (eventID && employeeID) {
        res.status(400).send("API route only works with one ID at a time");
      }
      const result = await getEvent(eventID, employeeID);
      res.send(result);
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for one of the IDs");
    }
  }
}
