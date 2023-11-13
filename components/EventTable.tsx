import Link from "next/link";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";
import PrintButton from "./PrintButton";
import { baseUrl, formatCedula } from "../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function EventTable({ eventID }: { eventID: string }) {
  const employeesQuery = useQuery({
    queryKey: ["employees", eventID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/employee?eventID=${eventID}`,
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });

  let mappedTable: ReactNode[] = [];

  if (!employeesQuery.isLoading && !employeesQuery.isError) {
    const employees: employee[] = employeesQuery.data;

    employees.forEach((employee: employee) => {
      employee.cedula = formatCedula(employee.cedula);
      employee.print = (
        <PrintButton
          employee_id={employee.id}
          event_id={eventID}
          has_printed_qr={employee.has_printed_qr}
          has_generated_qr={employee.has_generated_qr}
        />
      );

      employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
      employee.has_generated_qr = employee.has_generated_qr ? "Si" : "No";
    });

    mappedTable = employees.map((employeeRow) => {
      return <EventTableRow employeeRow={employeeRow} key={employeeRow.id} />;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Empleados asignados a este evento</h2>
      </div>
      <div className={styles.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>¿Ha imprimido el cintillo?</th>
              <th>Acceso</th>
              <th>¿Ha generado el código QR?</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!employeesQuery.isError && !employeesQuery.isLoading
              ? mappedTable
              : null}
          </tbody>
        </table>
      </div>
      {employeesQuery.isLoading
        ? <BeatLoader className={styles.icon} color="#6784c0" />
        : null}
    </div>
  );
}

export function EventTableRow({ employeeRow }: { employeeRow: employee }) {
  const cells = [];
  for (const column in employeeRow) {
    if (column === "id") {
    } else {
      cells.push(employeeRow[column]);
    }
  }

  const mappedCells = cells.map((cells, index) => {
    return <td key={"cell-" + cells + "-" + index}>{cells}</td>;
  });
  return (
    <tr>
      {mappedCells}
      <td>
        <Link href={`/employees/${employeeRow.id}`}>
          <FaEye size={22} />
        </Link>
      </td>
    </tr>
  );
}
