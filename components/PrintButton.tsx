import Link from "next/link";
import { postQr } from "../pages/api/postQr";

export default function PrintButton({
  event,
  employee,
}: {
  event: event;
  employee: employee;
}) {
  async function handlePrintClick() {
    const qrCodeString = postQr(employee.id, event.id);
  }

  return <Link href={"/qr"}></Link>;
}
