import Layout from "../../components/Layout";
import Table from "../../components/Table";

import getEmployeesFromEvent from "../api/getEmployeesFromEvent";
import getEvent from "../api/getEvent";

export default function Employee({
  employees,
  event,
}: {
  employees: any;
  event: event;
}) {
  return (
    <Layout>
      <Table data={employees} viewEndpoint="/employees/" />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const id = context.params.event;
  const event = await getEvent(id);
  const employees = await getEmployeesFromEvent(id);
  return { props: { employees, event } };
}
