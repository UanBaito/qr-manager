import Link from "next/link";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";
import PrintButton from "./PrintButton";
import { formatCedula } from "../lib/constants";

export default function EventTable({
  employees,
  viewEndpoint,
  event,
}: {
  employees: employee[];
  viewEndpoint: string;
  event: event;
}) {
  employees.forEach((employee: employee) => {
    employee.cedula = formatCedula(employee.cedula);
    employee.print = (
      <PrintButton employee_id={employee.id} event_id={event.id} />
    );

    employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
  });

  const employeeRow = employees.map((employeeRow) => {
    return (
      <EventTableRow
        employeeRow={employeeRow}
        key={employeeRow.id}
        viewEndpoint={viewEndpoint}
      />
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Empleados asignados a este evento</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>¿Ha imprimido el código QR?</th>
            <th>Acceso</th>
          </tr>
        </thead>
        <tbody>{employeeRow}</tbody>
      </table>
    </div>
  );
}

export function EventTableRow({
  employeeRow,
  viewEndpoint,
}: {
  employeeRow: employee;
  viewEndpoint: string;
}) {
  const cells = [];
  for (const column in employeeRow) {
    if (column === "id" || column === "created_at") {
    } else {
      cells.push(employeeRow[column]);
    }
  }

  const mappedCells = cells.map((cells) => {
    return <td key={"cell-" + cells}>{cells}</td>;
  });
  return (
    <tr>
      {mappedCells}
      <td>
        <Link href={viewEndpoint + employeeRow.id}>
          <FaEye size={22} />
        </Link>
      </td>
    </tr>
  );
}
