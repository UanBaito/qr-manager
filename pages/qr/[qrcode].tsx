import { getQrcode } from "../api/getQrcode";

export default function Qrcode({ results }) {
  return <></>;
}

export async function getServerSideProps(context) {
  const qrcode = context.params.qrcode;
  const results = await getQrcode(qrcode);
  console.log(results);
  return { props: { results } };
}
