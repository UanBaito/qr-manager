import { useEffect, useRef, useState } from "react";
import { postQr } from "../api/postQr";
import QRCode from "qrcode";
import { createCanvas } from "canvas";

export default function Qr({ string, isError }) {
  if (isError) {
    return <h1>Error creating qr code</h1>;
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const paintQr = async () => {
        await QRCode.toCanvas(
          canvasRef.current,
          "http://localhost:3000/qr/" + string
        );
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
      <canvas width={100} height={100} ref={canvasRef} />
      <h1>aaaaaaaa</h1>
    </>
  );
}

export async function getServerSideProps(context) {
  let string;
  let isError = false;
  const params = context.query;
  const employeeId = params.employee_id;
  const eventId = params.event_id;
  if (employeeId && eventId) {
    const results = await postQr(employeeId, eventId);
    string = results[0].qrcode_string;
  } else {
    string = null;
    isError = true;
  }

  return { props: { string, isError } };
}
