import { NextPageContext } from "next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QRCode from "qrcode";
import { baseUrl } from "../../lib/constants";
import { useEffect } from "react";

export default function Qr({ eventID, employeeID }) {
  useEffect(() => {
    qrcodeMutation.mutate();
  }, []);

  const queryClient = useQueryClient();
  ///TODO: figure out why query wont invalidate on chrome
  const qrcodeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/employees_events`, {
        method: "PUT",
        body: JSON.stringify({ employeeID: employeeID, eventID: eventID }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const qrcodeString = await res.json();
      return qrcodeString;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const employeeQuery = useQuery({
    queryKey: ["employee", employeeID],
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/employee?employeeID=${employeeID}`
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const employeeInfo = await res.json();
      return employeeInfo[0];
    },
    refetchOnWindowFocus: false,
  });

  const eventEmployeeQuery = useQuery({
    queryKey: ["eventEmployeeQuery", employeeID, eventID],
    queryFn: async () => {
      const res = await fetch(
        `${baseUrl}/api/employees_events?eventID=${eventID}&employeeID=${employeeID}`
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const relationInfo = await res.json();
      return relationInfo;
    },
    refetchOnWindowFocus: false,
  });

  const qrcodeString = qrcodeMutation.data;
  const employeeInfo = employeeQuery.data;
  const relationInfo = eventEmployeeQuery.data;

  const imageQuery = useQuery({
    queryKey: ["image", qrcodeString],
    queryFn: async () => {
      const qrCodeDataURL = await QRCode.toDataURL(
        `${qrcodeString.qrcode_string}`,
        { errorCorrectionLevel: "H" }
      );
      const res = await fetch(`${baseUrl}/api/image/`, {
        method: "POST",
        body: JSON.stringify({
          qrCodeDataURL: qrCodeDataURL,
          employeeInfo: employeeInfo,
          relationInfo: relationInfo,
        }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const imageURL = await res.json();
      return imageURL;
    },
    refetchOnWindowFocus: false,
    enabled: !!qrcodeString && !!employeeInfo && !!relationInfo,
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
    /// window.close();
  };

  return <img src={canvasDataURL} onLoad={printAndClose} />;
}

export async function getServerSideProps(context: NextPageContext) {
  const { eventID, employeeID } = context.query;
  return { props: { eventID, employeeID } };
}
