import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { getEvent } from "../api/event";

export default function events() {
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch(
        "https://qr-manager-two.vercel.app/api/event"
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      return await response.json();
    },
  });

  if (eventsQuery.isLoading) {
    return <>loading</>;
  }
  if (eventsQuery.isError) {
    return <>error</>;
  }

  const eventsList = eventsQuery.data;

  return (
    <Layout>
      <section>
        <Table data={eventsList} title="Eventos" viewEndpoint={"/events/"} />
      </section>
    </Layout>
  );
}
