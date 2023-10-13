import Layout from "../../components/Layout";
import Table from "../../components/Table";
import getEvents from "../api/getEvents";

export default function events({ eventsList }) {
  return (
    <Layout>
      <section>
        <Table data={eventsList} viewEndpoint={"/events/"} />
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const eventsList = await getEvents();

  return { props: { eventsList } };
}
