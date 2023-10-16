import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import format from "pg-format";

export async function getEmployee(eventID: string, employeeID: string) {
  let query = "";
  if (employeeID) {
    /// send especific employee
    query = format("SELECT * FROM employees WHERE id = '%s'", employeeID);
  } else if (eventID) {
    /// send employees from events
    query = format(
      "SELECT employees.id, employees.name, events_employees.has_printed_qr FROM employees, events_employees WHERE events_employees.event_id = '%s' AND events_employees.employee_id = employees.id",
      eventID
    );
  } else {
    ///send all employees
    query = "SELECT * FROM employees";
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
      const result = await getEmployee(eventID, employeeID);
      res.send(result);
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for one of the IDs");
    }
  }
}
