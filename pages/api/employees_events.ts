import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

async function getRelation(eventID: string, employeeID: string) {
  console.log(eventID, employeeID);
  const client = await db.connect();
  try {
    const relationResults = await client.query(
      "SELECT permission FROM events_employees WHERE event_id = $1 AND employee_id = $2",
      [eventID, employeeID]
    );
    return relationResults.rows;
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
      if (!eventID || !employeeID) {
        res.status(400).send("API endpoint needs both eventID and employeeID");
      }
      try {
        console.log(req.query);
        const result = await getRelation(eventID, employeeID);
        if (result.length === 0) {
          res.status(404).send("relation not found");
        }
        res.send(result[0]);
      } catch (err) {
        console.log(err);
        res.status(500).send("something went wrong");
      }
    } else {
      res
        .status(400)
        .send("Did not expect array of strings as value for one of the IDs");
    }
  }
}
