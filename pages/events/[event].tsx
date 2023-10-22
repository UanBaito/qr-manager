import Layout from "../../components/Layout";
import EventTable from "../../components/EventTable";
import styles from "../../styles/event.module.scss";
import CSVUpload from "../../components/CSVUpload";
import { useRef } from "react";
import EventInfo from "../../components/EventInfo";
import ExportQrcodes from "../../components/ExportQrcodes";
import CreateQRcodes from "../../components/CreateQRcodes";

export default function Event({ eventID }) {
  const messageDivRef = useRef<HTMLDivElement>(null);

  return (
    <Layout>
      <section className={styles.container}>
        <EventInfo eventID={eventID} />
        <div ref={messageDivRef} className={styles.message}></div>
        <div className={styles.table_container}>
          <ExportQrcodes eventID={eventID} />
          <CreateQRcodes />
          <EventTable eventID={eventID} />
          {/* {employees.length === 0 ? <EmployeesNotFound message={"a"} /> : null} */}
          <CSVUpload eventID={eventID} messageDivRef={messageDivRef} />
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const eventID = context.params.event;
  return { props: { eventID } };
}
