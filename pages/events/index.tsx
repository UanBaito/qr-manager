import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import { getEvent } from "../api/event";
import { baseUrl } from "../../lib/constants";
import EventCardList from "../../components/EventCardList";
import style from "../../styles/events.module.scss";

export default function events() {
  return (
    <Layout>
      <section className={style.section}>
        <EventCardList />
      </section>
    </Layout>
  );
}
