import Link from "next/link";
import PrintButton from "./PrintButton";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";

export default function EmployeeTable({
  events,
  viewEndpoint,
  employee,
}: {
  employee: employee;
  viewEndpoint: string;
  events: event[];
}) {
  events.forEach((event: event) => {
    employee.print = (
      <PrintButton employee_id={employee.id} event_id={event.id} />
    );
    employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
  });

  const eventRow = events.map((eventRow) => {
    return (
      <EventTableRow
        eventRow={eventRow}
        key={eventRow.id}
        viewEndpoint={viewEndpoint}
      />
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Eventos asignados a este empleado</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>¿Ha imprimido el código QR?</th>
          </tr>
        </thead>
        <tbody>{eventRow}</tbody>
      </table>
    </div>
  );
}

export function EventTableRow({
  eventRow,
  viewEndpoint,
}: {
  eventRow: event;
  viewEndpoint: string;
}) {
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
        <Link href={viewEndpoint + eventRow.id}>
          <FaEye size={22} />
        </Link>
      </td>
    </tr>
  );
}
