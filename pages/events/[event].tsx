import Layout from "../../components/Layout";
import Table from "../../components/Table";
import styles from "../../styles/event.module.scss";
import PrintButton from "../../components/PrintButton";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

export default function Event({ eventID }) {
  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:3000/api/event?eventID=" + eventID
      );
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
        "http://localhost:3000/api/employee?eventID=" + eventID
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });

  ///TODO: separate this so the whole application wont stop if there is an error with one of the two queries

  if (eventQuery.isLoading || employeesQuery.isLoading) {
    return <>...loading</>;
  }

  if (eventQuery.isError || employeesQuery.isError) {
    return <>error</>;
  }

  const event = eventQuery.data[0];
  const employees = employeesQuery.data;
  console.log(employees);

  // / I do this because I want to modify one of the properties, but dont want to change the original
  // / object in case I may need it later
  const EmployeesArrayCopy = [...employees];
  EmployeesArrayCopy.forEach((employee: employee) => {
    employee.print = (
      <PrintButton employee_id={employee.id} event_id={event.id} />
    );
    employee.has_printed_qr = employee.has_printed_qr ? "Si" : "No";
  });

  return (
    <Layout>
      <section className={styles.container}>
        <h1>Evento</h1>
        <div className={styles.info}>
          <ul>
            <li>
              <h2>Nombre del evento: </h2>
              <span>{event.name}</span>
            </li>
          </ul>
        </div>
        <Table
          data={EmployeesArrayCopy}
          title="Empleados asignados a este evento"
          viewEndpoint="/employees/"
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const eventID = context.params.event;
  return { props: { eventID } };
}
