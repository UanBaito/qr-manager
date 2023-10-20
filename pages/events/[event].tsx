import Layout from "../../components/Layout";
import Table from "../../components/Table";
import styles from "../../styles/event.module.scss";
import PrintButton from "../../components/PrintButton";
import { useQuery } from "@tanstack/react-query";
import CSVUpload from "../../components/CSVUpload";
import { baseUrl } from "../../lib/constants";
import EmployeesNotFound from "../../components/EmployeesNotFound";
import { useRef } from "react";

export default function Event({ eventID }) {
  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/event?eventID=${eventID}`);
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });
  const employeesQuery = useQuery({
    queryKey: ["employees", eventID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/employee?eventID=${eventID}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });
  const messageDivRef = useRef<HTMLDivElement>(null);

  ///TODO: separate this so the whole application wont stop if there is an error with one of the two queries

  if (eventQuery.isLoading || employeesQuery.isLoading) {
    return (
      <Layout>
        <section className={styles.container}>
          <>loading...</>
        </section>
      </Layout>
    );
  }

  if (eventQuery.isError || employeesQuery.isError) {
    return (
      <Layout>
        <section className={styles.container}>
          <>loading...</>
        </section>
      </Layout>
    );
  }

  function formatCedula(cedula: string) {
    const firstThreeDigits = cedula.substring(0, 3);
    const middleThreeDigits = cedula.substring(3, 6);
    const middleFourDigits = cedula.substring(6, 10);
    const lastDigit = cedula.charAt(10);
    return `${firstThreeDigits}-${middleThreeDigits}-${middleFourDigits}-${lastDigit}`;
  }
  const event: event = eventQuery.data[0];
  const employees: employee[] = employeesQuery.data;

  // / I do this because I want to modify one of the properties, but dont want to change the original
  // / object in case I may need it later
  const EmployeesArrayCopy = [...employees];
  EmployeesArrayCopy.forEach((employee: employee) => {
    employee.cedula = formatCedula(employee.cedula);
    employee.print = (
      <PrintButton employee_id={employee.id} event_id={event.id} />
    );

    employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
  });

  return (
    <Layout>
      <section className={styles.container}>
        <h1>{event.name}</h1>
        <img src="/music_logo.png" alt="Event logo"></img>
        <div ref={messageDivRef} className={styles.message}></div>
        <div className={styles.table_container}>
          <Table data={EmployeesArrayCopy} viewEndpoint="/employees/" />
          {employees.length === 0 ? <EmployeesNotFound /> : null}
          <CSVUpload eventID={event.id} messageDivRef={messageDivRef} />
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const eventID = context.params.event;
  return { props: { eventID } };
}
