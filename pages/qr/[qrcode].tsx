import { useQuery } from "@tanstack/react-query";
import { NextPageContext } from "next";

export default function Qrcode({ qrcode }) {
  const validateQrQuery = useQuery({
    queryKey: ["validateQr", qrcode],
    queryFn: async () => {
      const res = await fetch(
        "https://qr-manager-two.vercel.app/api/qrcode?qrcode=" + qrcode
      );
      if (res.status === 404) {
        throw new Error("Qrcode does not exist on database");
      } else if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const result = await res.json();
      return result;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (validateQrQuery.isLoading) {
    return <>loading</>;
  }

  if (validateQrQuery.isError) {
    if (validateQrQuery.error instanceof Error) {
      return <>{validateQrQuery.error.message}</>;
    }
    return <>Something went wrong</>;
  }

  const { age } = validateQrQuery.data;

  if (age >= 1) {
    return <>qrcode has expired</>;
  } else {
    return <>qrcode is valid</>;
  }
}

export async function getServerSideProps(context: NextPageContext) {
  const qrcode = context.query.qrcode;
  return { props: { qrcode } };
}
