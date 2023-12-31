import Link from "next/link";
import PrintButton from "./PrintButton";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../lib/constants";
import { ReactNode } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function EmployeeTable({ employeeID }: { employeeID: string }) {
  const eventsQuery = useQuery({
    queryKey: ["events", employeeID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/event?employeeID=${employeeID}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });

  let mappedTable: ReactNode[] = [];
  if (!eventsQuery.isLoading && !eventsQuery.isError) {
    const events: event[] = eventsQuery.data;

    events.forEach((event: event) => {
      event.print = (
        <PrintButton
          employee_id={employeeID}
          event_id={event.id}
          has_printed_qr={event.has_printed_qr}
          has_generated_qr={event.has_generated_qr}
        />
      );
      event.has_printed_qr = event.has_printed_qr ? "Si" : "No";
      event.has_generated_qr = event.has_generated_qr ? "Si" : "No";
    });

    mappedTable = events.map((eventRow) => {
      return <EventTableRow eventRow={eventRow} key={eventRow.id} />;
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Eventos asignados a este empleado</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>¿Ha imprimido el cintillo?</th>
            <th>¿Ha generado el código QR?</th>
          </tr>
        </thead>
        <tbody>
          {!eventsQuery.isError && !eventsQuery.isLoading ? mappedTable : null}
        </tbody>
      </table>
      {eventsQuery.isLoading ? (
        <BeatLoader className={styles.icon} color="#6784c0" />
      ) : null}
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

  const mappedCells = cells.map((cells, index) => {
    return <td key={"cell-" + cells + "-" + index}>{cells}</td>;
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
