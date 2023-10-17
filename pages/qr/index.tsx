import { NextPageContext } from "next";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";

export default function Qr({ eventID, employeeID }) {
  const qrcodeQuery = useQuery({
    queryKey: ["qrcode", employeeID, eventID],
    queryFn: async () => {
      const res = await fetch("https://qr-manager-two.vercel.app/api/qrcode", {
        method: "POST",
        body: JSON.stringify({ employeeID: employeeID, eventID: eventID }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const qrcodeString = await res.json();
      return qrcodeString;
    },
    refetchOnWindowFocus: false,
  });
  const employeeQuery = useQuery({
    queryKey: ["employee", employeeID],
    queryFn: async () => {
      const res = await fetch(
        "https://qr-manager-two.vercel.app/api/employee?employeeID=" +
          employeeID
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const employeeInfo = await res.json();
      return employeeInfo[0];
    },
    refetchOnWindowFocus: false,
  });

  const qrcodeString = qrcodeQuery.data;
  const employeeInfo = employeeQuery.data;

  const imageQuery = useQuery({
    queryKey: ["image", qrcodeString],
    queryFn: async () => {
      const qrCodeDataURL = await QRCode.toDataURL(
        "https://qr-manager-two.vercel.app/qr/" + qrcodeString.qrcode_string,
        { errorCorrectionLevel: "H" }
      );
      const res = await fetch("https://qr-manager-two.vercel.app/api/image/", {
        method: "POST",
        body: JSON.stringify({
          qrCodeDataURL: qrCodeDataURL,
          employeeInfo: employeeInfo,
        }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const imageURL = await res.json();
      return imageURL;
    },
    refetchOnWindowFocus: false,
    enabled: !!qrcodeString && !!employeeInfo,
  });

  if (imageQuery.isLoading) {
    return <>Loading</>;
  }
  if (imageQuery.isError) {
    return <>error</>;
  }

  const canvasDataURL = imageQuery.data;
  const printAndClose = () => {
    window.print();
    window.close();
  };

  return <img src={canvasDataURL} onLoad={printAndClose} />;
}

export async function getServerSideProps(context: NextPageContext) {
  const { eventID, employeeID } = context.query;
  return { props: { eventID, employeeID } };
}
