import { createCanvas } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const canvas = createCanvas(200, 800);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, 200, 800);

  res.send(`<img src="${canvas.toDataURL()}" /> `);
}
