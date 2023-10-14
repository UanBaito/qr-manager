import Layout from "../../components/Layout";
import PrintButton from "../../components/PrintButton";
import Table from "../../components/Table";
import getEmployee from "../api/getEmployee";
import getEventsFromEmployee from "../api/getEventsFromEmployee";

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
  });
  ///TODO: fix this

  return (
    <Layout>
      <Table data={events} viewEndpoint="/events/" />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.employee;
  const employee = await getEmployee(id);
  const events = await getEventsFromEmployee(id);
  return { props: { employee, events } };
}
