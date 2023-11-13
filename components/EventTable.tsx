import Link from "next/link";
import styles from "./Table.module.scss";
import { FaEye } from "react-icons/fa6";
import PrintButton from "./PrintButton";
import { baseUrl, formatCedula } from "../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function EventTable({ eventID }: { eventID: string }) {
  const [searchQuery, setSearchQuery] = useState("");
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

  function filterEmployees(employeesList: employee[], searchQuery: string) {
    if (searchQuery === "") {
      return employeesList;
    } else {
      const queryRegex = new RegExp(`${searchQuery}`, "i");
      const filteredEmployees = employeesList.filter((
        employee,
      ) => (queryRegex.test(employee.name)));
      return filteredEmployees;
    }
  }

  if (!employeesQuery.isLoading && !employeesQuery.isError) {
    const employees: employee[] = employeesQuery.data;

    const filteredEmployees = filterEmployees(employees, searchQuery);

    const mappedEmployees = filteredEmployees.map((employee: employee) => {
      //Employee object must be cloned or else formatCedula will be called in the same object each render and 
      //generate some bugs.
      let employeeClone = {...employee}
      employeeClone.cedula = formatCedula(employeeClone.cedula);
      employeeClone.print = (
        <PrintButton
          employee_id={employeeClone.id}
          event_id={eventID}
          has_printed_qr={employeeClone.has_printed_qr}
          has_generated_qr={employeeClone.has_generated_qr}
        />
      );
      employeeClone.has_printed_qr = employeeClone.has_printed_qr ? "Si" : "No";
      employeeClone.has_generated_qr = employeeClone.has_generated_qr ? "Si" : "No";
      return employeeClone
    });

    mappedTable = mappedEmployees.map((employeeRow) => {
      return <EventTableRow employeeRow={employeeRow} key={employeeRow.id} />;
    });
  }

  return (
    <section
      className={styles.container}
      aria-labelledby="table_title_container"
    >
      <div className={styles.table_title_container}>
        <h2 id="table_title_container">Empleados asignados a este evento</h2>
      </div>
      <div className={styles.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Compania</th>
              <th>¿Ha imprimido el cintillo?</th>
              <th>Acceso</th>
              <th>¿Ha generado el código QR?</th>
            </tr>
          </thead>
          <tbody>
            {!employeesQuery.isError && !employeesQuery.isLoading
              ? mappedTable
              : null}
          </tbody>
        </table>
      </div>
      <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>¿Ha imprimido el cintillo?</th>
            <th>Acceso</th>
            <th>¿Ha generado el código QR?</th>
          </tr>
        </thead>
        <tbody>
          {!employeesQuery.isError && !employeesQuery.isLoading
            ? mappedTable
            : null}
        </tbody>
      </table>
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

export function Searchbar(
  { searchQuery, setSearchQuery }: {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  },
) {
  return (
    <form onSubmit={(e) => {e.preventDefault()}} className={styles.searchbar}>
      <section aria-labelledby="employee_search_label">
        <label htmlFor="employee_search" id="employee_search_label">Search</label>
        <input
          id="employee_search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </section>
    </form>
  );
}
