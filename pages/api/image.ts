import { createCanvas, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const url = process.env.VERCEL_URL;
    const content = JSON.parse(req.body);
    const qrcode = await loadImage(content.qrCodeDataURL);
    const logo = await loadImage(process.cwd() + "public/pajaro1.png");
    const employeeInfo: employee = content.employeeInfo;
    const names = employeeInfo.name.split(" ");
    const capitalizedNamesArray = names.map((name) => {
      return name.charAt(0).toUpperCase() + name.substring(1);
    });
    const capitalizedNames = capitalizedNamesArray.join(" ");
    const canvas = createCanvas(529.13385827, 64.251968504);
    const ctx = canvas.getContext("2d");
    // ctx.translate(300, 0);
    // ctx.rotate((Math.PI / 180) * 90);
    ctx.fillStyle = "darkblue";
    ctx.fillRect(0, 0, 529.13385827, 68.251968504);
    ctx.fillStyle = "white";
    ctx.fillRect(250, 0, 64.251968504, 64.251968504);
    ctx.drawImage(qrcode, 0, 0, 64.251968504, 64.251968504);
    ctx.drawImage(logo, 250, 0, 64.251968504, 64.251968504);
    ctx.font = "16px Ubuntu";
    ctx.fillStyle = "white";
    ctx.fillText(capitalizedNames, 125, 36.251968504);
    res.send(JSON.stringify(canvas.toDataURL()));
  } else {
    res.status(400).send("method not allowed");
  }
}
