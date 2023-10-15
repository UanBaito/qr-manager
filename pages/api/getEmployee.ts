import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export async function getEmployee(id: string) {
  const client = await db.connect();
  const results = await client.query<employee>(
    "SELECT * FROM employees WHERE id = $1",
    [id]
  );
  client.release();
  return results.rows;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await getEmployee(req.body.id);
  res.send(200);
}
