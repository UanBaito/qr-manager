import Layout from "../../components/Layout";
import PrintButton from "../../components/PrintButton";
import Table from "../../components/Table";
import getEmployee from "../api/getEmployee";
import getEventsFromEmployee from "../api/getEventsFromEmployee";
import styles from "../../styles/employess.module.scss";

export default function Employee({
  employee,
  events,
}: {
  employee: employee;
  events: any;
}) {
  employee = employee[0];

  const mappedEvents = events.map((event: event) => {
    event.print = <PrintButton employee_id={employee.id} event_id={event.id} />;
    event.has_printed_qr = event.has_printed_qr ? "Yes" : "No";
  });
  console.log(events);
  ///TODO: fix this, use a copy of the original array instead

  return (
    <Layout>
      <section className={styles.container}>
        <h1>Employee</h1>
        <div className={styles.info}>
          <ul>
            <li>
              <h2>Name: </h2>
              <span>{employee.name}</span>
            </li>
            <li>
              <h2>Email: </h2>
              <span>{employee.email}</span>
            </li>
            <li>
              <h2>Cedula: </h2>
              <span>{employee.cedula}</span>
            </li>
            <li>
              <h2>Company: </h2>
              <span>{employee.company}</span>
            </li>
            <li>
              <h2>Permission: </h2>
              <span>{employee.permission}</span>
            </li>
          </ul>
        </div>
        <Table
          data={events}
          title="Allowed events for employee"
          viewEndpoint="/events/"
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.employee;
  const employee = await getEmployee(id);
  const events = await getEventsFromEmployee(id);
  return { props: { employee, events } };
}
