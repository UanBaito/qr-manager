import Link from "next/link";
import { FaPrint } from "react-icons/fa6";

export default function PrintButton({
  event_id,
  employee_id,
}: {
  event_id: string;
  employee_id: string;
}) {
  return (
    <a
      target="_blank"
      href={`/qr?employeeID=${employee_id}&eventID=${event_id}`}
    >
      <FaPrint />
    </a>
  );
}
