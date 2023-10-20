import Link from "next/link";
import PrintButton from "./PrintButton";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";

export default function EmployeeTable({
  events,
  employee,
}: {
  employee: employee;
  events: event[];
}) {
  events.forEach((event: event) => {
    employee.print = (
      <PrintButton employee_id={employee.id} event_id={event.id} />
    );
    employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
  });

  const eventRow = events.map((eventRow) => {
    return <EventTableRow eventRow={eventRow} key={eventRow.id} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Eventos asignados a este empleado</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>¿Ha imprimido el código QR?</th>
          </tr>
        </thead>
        <tbody>{eventRow}</tbody>
      </table>
    </div>
  );
}

export function EventTableRow({ eventRow }: { eventRow: event }) {
  const cells = [];
  for (const column in eventRow) {
    if (column === "id") {
    } else {
      cells.push(eventRow[column]);
    }
  }

  const mappedCells = cells.map((cells) => {
    return <td key={"cell-" + cells}>{cells}</td>;
  });
  return (
    <tr>
      {mappedCells}
      <td>
        <Link href={`/events/${eventRow.id}`}>
          <FaEye size={22} />
        </Link>
      </td>
    </tr>
  );
}
