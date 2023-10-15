import Table from "../../components/Table";
import Layout from "../../components/Layout";
import getEmployees from "../api/getEmployees";
import ViewData from "../../components/ViewData";

export default function Employees({ employessList }) {
  return (
    <Layout>
      <section>
        <Table
          data={employessList}
          viewEndpoint="/employees/"
          title="employees"
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const employessList = await getEmployees();
  return { props: { employessList } };
}
