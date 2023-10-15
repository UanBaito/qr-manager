import { useEffect, useRef, useState } from "react";
import { postQr } from "../api/postQr";
import QRCode from "qrcode";
import { createCanvas } from "canvas";
import { getEmployee } from "../api/getEmployee";

export default function Qr({
  employee,
  string,
  isError,
}: {
  employee: employee;
  string: string;
  isError: boolean;
}) {
  if (isError) {
    return <h1>Error creating qr code</h1>;
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const paintQr = async () => {
        const ctx = canvasRef.current.getContext("2d");
        await QRCode.toCanvas(
          canvasRef.current,
          "http://localhost:3000/qr/" + string
        );
        ctx.strokeText(employee.name, 0, 0);
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 100, 100, 100);

        window.print();
        window.close();
      };
      paintQr();
    }
  }, [canvasRef.current]);
  if (canvasRef.current) {
  }
  return (
    <>
      <canvas width={400} height={400} ref={canvasRef} id="canvas" />
    </>
  );
}

export async function getServerSideProps(context) {
  let string = null;
  let isError = false;
  let employee: null | employee = null;
  const params = context.query;
  const employeeId = params.employee_id;
  const eventId = params.event_id;
  if (employeeId && eventId) {
    try {
      employee = await getEmployee(employeeId);
      const qrResults = await postQr(employeeId, eventId);
      string = qrResults[0].qrcode_string;
    } catch (err) {
      isError = true;
      console.log(err);
    }
  } else {
    isError = true;
  }

  return { props: { string, isError, employee } };
}
////a
