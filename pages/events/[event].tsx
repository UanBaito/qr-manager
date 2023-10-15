import Layout from "../../components/Layout";
import Table from "../../components/Table";
import getEmployeesFromEvent from "../api/getEmployeesFromEvent";
import getEvent from "../api/getEvent";
import styles from "../../styles/event.module.scss";
import PrintButton from "../../components/PrintButton";

export default function Event({
  employees,
  event,
}: {
  employees: any;
  event: event;
}) {
  console.log(employees);

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
  const id = context.params.event;
  const eventResult = await getEvent(id);
  const event = eventResult[0];
  const employees = await getEmployeesFromEvent(id);
  console.log(employees);
  return { props: { employees, event } };
}
