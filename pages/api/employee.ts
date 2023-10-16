import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import format from "pg-format";
import fs from "fs";
import { from as copyFrom } from "pg-copy-streams";
import { pipeline } from "node:stream/promises";

export async function getEmployee(eventID?: string, employeeID?: string) {
  let query = "";
  if (employeeID) {
    /// send especific employee
    query = format("SELECT * FROM employees WHERE id = '%s'", employeeID);
  } else if (eventID) {
    /// send employees from events
    query = format(
      "SELECT employees.id, employees.name, employees.cedula, events_employees.has_printed_qr FROM employees, events_employees WHERE events_employees.event_id = '%s' AND events_employees.employee_id = employees.id ORDER BY name DESC",
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

export async function postEmployee(text: string) {
  console.log(text);

  fs.writeFile("lib/empleados.csv", text, (err) => {
    if (err) throw err;
    console.log("file saved");
  });
  const client = await db.connect();
  try {
    await client.query("BEGIN;");
    await client.query(
      "CREATE TEMP TABLE tmp_table (LIKE employees INCLUDING DEFAULTS) ON COMMIT DROP;"
    );
    const ingestStream = client.query(
      copyFrom(
        "COPY tmp_table(name, email, company, permission, cedula) FROM STDIN DELIMITER ',' CSV HEADER;"
      )
    );
    const sourceStream = fs.createReadStream("lib/empleados.csv");
    await pipeline(sourceStream, ingestStream);
    await client.query(
      "INSERT INTO employees SELECT * FROM tmp_table ON CONFLICT DO NOTHING;"
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
  if (req.method === "POST") {
    /// TODO: fix this part here
    try {
      postEmployee(req.body);
      res.send("Database updated");
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
}
