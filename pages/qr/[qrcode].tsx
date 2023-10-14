import { getQrcode } from "../api/getQrcode";

export default function Qrcode({ hasExpired, isError, error }) {
  if (isError) {
    console.log(error, isError);
    return (
      <>
        <h1>{error}</h1>
      </>
    );
  }
  if (hasExpired === false) {
    return <>qrcode has expired</>;
  } else if (hasExpired === true) {
    return <>qrcode is valid</>;
  }
}

export async function getServerSideProps(context) {
  let hasExpired = null;
  let qrcodeResult = null;
  let isError = false;
  let error = null;
  try {
    const qrcode = context.params.qrcode;
    qrcodeResult = await getQrcode(qrcode);
    console.log(qrcodeResult);
  } catch (err) {
    qrcodeResult = null;
    isError = true;
    error = "there was an error while validating the code";
  }
  if (qrcodeResult) {
    hasExpired = qrcodeResult.age >= 1 ? true : false;
  } else {
    isError = true;
    error = "code does not exist on database";
  }

  return { props: { hasExpired, isError, error } };
}
