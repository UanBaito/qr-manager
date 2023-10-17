import Layout from "../../components/Layout";

export default function Employees({ employessList }) {
  return (
    <Layout>
      {/* <section>
        <Table
          data={employessList}
          viewEndpoint="/employees/"
          title="employees"
        />
      </section> */}
    </Layout>
  );
}

// export async function getServerSideProps() {
//   // const employessList = await getEmployees();
//   // return { props: { employessList } };
// }
