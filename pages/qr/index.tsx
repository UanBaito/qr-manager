import { useEffect, useRef, useState } from "react";
import { postQr } from "../api/postQr";
import QRCode from "qrcode";
import { createCanvas } from "canvas";

export default function Qr({ string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current !== null) {
      const paintQr = async () => {
        await QRCode.toCanvas(
          canvasRef.current,
          "http://localhost:3000/qr/string" + string
        );
      };
      paintQr();
    }
  }, [canvasRef.current]);

  return (
    <>
      <canvas width={100} height={100} ref={canvasRef} />
      <h1>aaaaaaaa</h1>
    </>
  );
}

export async function getServerSideProps(context) {
  const params = context.query;
  const employeeId = params.employee_id;
  const eventId = params.event_id;
  const results = await postQr(employeeId, eventId);
  const string = results[0].string;
  return { props: { string } };
}
