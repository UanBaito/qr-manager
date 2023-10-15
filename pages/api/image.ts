import { createCanvas, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const content = JSON.parse(req.body);

  const qrcode = await loadImage(content.qrstring);
  const logo = await loadImage("public/pajaro1.png");

  const employeeInfo: employee = content.employeeInfo;

  const names = employeeInfo.name.split(" ");
  const capitalizedNamesArray = names.map((name) => {
    return name.charAt(0).toUpperCase() + name.substring(1);
  });
  const capitalizedNames = capitalizedNamesArray.join(" ");

  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext("2d");

  ctx.translate(300, 0);
  ctx.rotate((Math.PI / 180) * 90);

  ctx.fillStyle = "darkblue";
  ctx.fillRect(0, 0, 800, 200);
  ctx.fillStyle = "white";
  ctx.fillRect(450, 20, 200, 160);
  ctx.drawImage(qrcode, 20, 25);
  ctx.drawImage(logo, 475, 25, 150, 150);

  ctx.font = "48px Roboto";
  ctx.fillStyle = "white";
  ctx.fillText(capitalizedNames, 200, 100);

  res.send(JSON.stringify(canvas.toDataURL()));
}
