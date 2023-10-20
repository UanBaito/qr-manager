import { useQuery } from "@tanstack/react-query";
import styles from "./Employeeinfo.module.scss";
import { baseUrl, formatCedula } from "../lib/constants";
import NotFound from "./NotFound";

export default function EmployeeInfo({ employeeID }: { employeeID: string }) {
  const employeeQuery = useQuery({
    queryKey: ["employee", employeeID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/employee?employeeID=${employeeID}`
      );
      if (!response.ok) {
        throw new Error("Algo salió mal");
      } else {
        const result: employee[] = await response.json();
        if (result.length === 0) {
          throw new Error("Empleado no encontrado");
        }
        return result;
      }
    },
  });

  let employeeInfo: employee;
  let formattedCedula: string;

  if (!employeeQuery.isLoading && !employeeQuery.isError) {
    employeeInfo = employeeQuery.data[0];
    formattedCedula = formatCedula(employeeInfo.cedula);
  }

  return (
    <div
      className={
        employeeQuery.isLoading
          ? styles.loading
          : employeeQuery.isError
          ? styles.error
          : styles.info
      }
    >
      {employeeQuery.isError ? (
        <div className={styles.error_message}>
          <NotFound message={employeeQuery.error.message} />
        </div>
      ) : (
        <ul>
          <li>
            <h2>Nombre: </h2>
            <span className={styles.capitalize}>
              {employeeInfo?.name ?? ""}
            </span>
          </li>
          <li>
            <h2>Email: </h2>
            <span>{employeeInfo?.email ?? ""}</span>
          </li>
          <li>
            <h2>Cedula: </h2>
            <span>{formattedCedula ?? ""}</span>
          </li>
          <li>
            <h2>Compañia: </h2>
            <span className={styles.capitalize}>
              {employeeInfo?.company ?? ""}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
