import { createCanvas, loadImage } from "canvas";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const content = JSON.parse(req.body);

  const qrcode = await loadImage(content.qrCodeDataURL);
  const logo = await loadImage(
    path.join(process.cwd(), "public", "PNG_transparency_demonstration_1.png")
  );
  const logoWidth = logo.width;
  const logoHeight = logo.height;

  const employeeInfo: employee = content.employeeInfo;
  const relationInfo = content.relationInfo;
  const cedula = employeeInfo.cedula;
  const permission: string = relationInfo.permission;

  const capitalizedPermission =
    permission.charAt(0).toUpperCase() + permission.substring(1);

  function formatCedula(cedula: string) {
    const firstThreeDigits = cedula.substring(0, 3);
    const middleThreeDigits = cedula.substring(3, 6);
    const middleFourDigits = cedula.substring(6, 10);
    const lastDigit = cedula.charAt(10);
    return `${firstThreeDigits}-${middleThreeDigits}-${middleFourDigits}-${lastDigit}`;
  }

  const formattedCedula = formatCedula(cedula);
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
  ctx.drawImage(qrcode, 0, 0, 64.251968504, 64.251968504);
  ctx.drawImage(
    logo,
    250,
    0,
    logoWidth * (64.251968504 / logoHeight),
    64.251968504
  );
  ctx.font = "12px Ubuntu";
  ctx.fillStyle = "white";
  ctx.fillText(`Nombre: ${capitalizedNames}`, 75, 36.251968504);
  ctx.fillText(`Cedula: ${formattedCedula}`, 75, 16.251968504);
  ctx.fillText(`Tipo de acceso: ${capitalizedPermission}`, 75, 56.251968504);

  res.send(JSON.stringify(canvas.toDataURL()));
}
