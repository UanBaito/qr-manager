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

  const [canvasState, setCanvasState] = useState(null);

  useEffect(() => {
    const fetchQr = async () => {
      const qrStringResult = await QRCode.toDataURL(string);
      const response = await fetch("http://localhost:3000/api/image", {
        method: "POST",
        body: JSON.stringify({
          qrstring: qrStringResult,
          employeeInfo: employee,
        }),
      });
      const content = await response.json();

      setCanvasState(content);
    };
    fetchQr();
  }, []);

  if (!canvasState) {
    return;
  }

  return (
    <>
      <img src={canvasState} />
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
