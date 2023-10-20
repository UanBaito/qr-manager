import Layout from "../../components/Layout";
import styles from "../../styles/employee.module.scss";
import { useQuery } from "@tanstack/react-query";

import { baseUrl, formatCedula } from "../../lib/constants";
import EmployeeTable from "../../components/EmployeeTable";

export default function Employee({ employeeID }) {
  const employeeQuery = useQuery({
    queryKey: ["employee", employeeID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/employee?employeeID=${employeeID}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });

  if (employeeQuery.isLoading) {
    return <>loading</>;
  }

  if (employeeQuery.isError) {
    return <>error</>;
  }

  const employee: employee = employeeQuery.data[0];

  const formattedCedula = formatCedula(employee.cedula);

  return (
    <Layout>
      <section className={styles.container}>
        <div className={styles.info}>
          <ul>
            <li>
              <h2>Nombre: </h2>
              <span className={styles.capitalize}>{employee.name}</span>
            </li>
            <li>
              <h2>Email: </h2>
              <span>{employee.email}</span>
            </li>
            <li>
              <h2>Cedula: </h2>
              <span>{formattedCedula}</span>
            </li>
            <li>
              <h2>Compañia: </h2>
              <span className={styles.capitalize}>{employee.company}</span>
            </li>
          </ul>
        </div>
        <EmployeeTable employee={employee} />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const employeeID = context.params.employee;
  return { props: { employeeID } };
}
