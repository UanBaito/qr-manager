import Link from "next/link";

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
      href={`/qr?employee_id=${employee_id}&event_id=${event_id}`}
    >
      Print
    </a>
  );
}
