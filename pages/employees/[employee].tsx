import Layout from "../../components/Layout";
import Table from "../../components/Table";
import getEmployee from "../api/getEmployee";
import getEventsFromEmployee from "../api/getEventsFromEmployee";
import { postQr } from "../api/postQr";

export default function Employee({
  employee,
  events,
}: {
  employee: employee;
  events: any;
}) {
  employee = employee[0];

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
