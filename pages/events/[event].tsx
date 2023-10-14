import Layout from "../../components/Layout";
import Table from "../../components/Table";
import getEmployeesFromEvent from "../api/getEmployeesFromEvent";
import getEvent from "../api/getEvent";
import styles from "../../styles/event.module.scss";

export default function Event({
  employees,
  event,
}: {
  employees: any;
  event: event;
}) {
  console.log(event);
  return (
    <Layout>
      <section className={styles.container}>
        <h1>Event</h1>
        <div className={styles.info}>
          <ul>
            <li>
              <h2>Name: </h2>
              <span>{event.name}</span>
            </li>
          </ul>
        </div>
        <Table
          data={employees}
          title="Employees assigned to this event"
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
  return { props: { employees, event } };
}
