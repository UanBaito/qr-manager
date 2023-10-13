import Layout from "../../components/Layout";
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
  console.log(events);
  return (
    <Layout>
      <Table data={events} viewEndpoint="/events/" />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.employee;
  console.log(id);
  const employee = await getEmployee(id);
  const events = await getEventsFromEmployee(id);
  return { props: { employee, events } };
}
