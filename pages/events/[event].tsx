import Layout from "../../components/Layout";
import Table from "../../components/EventTable";
import styles from "../../styles/event.module.scss";
import PrintButton from "../../components/PrintButton";
import { useQuery } from "@tanstack/react-query";
import CSVUpload from "../../components/CSVUpload";
import { baseUrl } from "../../lib/constants";
import EmployeesNotFound from "../../components/EmployeesNotFound";
import { useRef } from "react";

export default function Event({ eventID }) {
  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/event?eventID=${eventID}`);
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });
  const employeesQuery = useQuery({
    queryKey: ["employees", eventID],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/employee?eventID=${eventID}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      } else {
        return await response.json();
      }
    },
  });
  const messageDivRef = useRef<HTMLDivElement>(null);

  ///TODO: separate this so the whole application wont stop if there is an error with one of the two queries

  if (eventQuery.isLoading || employeesQuery.isLoading) {
    return (
      <Layout>
        <section className={styles.container}>
          <>loading...</>
        </section>
      </Layout>
    );
  }

  if (eventQuery.isError || employeesQuery.isError) {
    return (
      <Layout>
        <section className={styles.container}>
          <>loading...</>
        </section>
      </Layout>
    );
  }

  const event: event = eventQuery.data[0];
  const employees: employee[] = employeesQuery.data;

  return (
    <Layout>
      <section className={styles.container}>
        <h1>{event.name}</h1>
        <img src="/music_logo.png" alt="Event logo"></img>
        <div ref={messageDivRef} className={styles.message}></div>
        <div className={styles.table_container}>
          <Table employees={employees} event={event} />
          {employees.length === 0 ? <EmployeesNotFound /> : null}
          <CSVUpload eventID={event.id} messageDivRef={messageDivRef} />
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const eventID = context.params.event;
  return { props: { eventID } };
}
