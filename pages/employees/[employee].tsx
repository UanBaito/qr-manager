import Layout from "../../components/Layout";
import styles from "../../styles/employee.module.scss";
import { useQuery } from "@tanstack/react-query";

import { baseUrl, formatCedula } from "../../lib/constants";
import EmployeeTable from "../../components/EmployeeTable";
import EmployeeInfo from "../../components/EmployeeInfo";

export default function Employee({ employeeID }) {
  return (
    <Layout>
      <section className={styles.container}>
        <EmployeeInfo employeeID={employeeID} />
        <EmployeeTable employeeID={employeeID} />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const employeeID = context.params.employee;
  return { props: { employeeID } };
}
