import Layout from "../../components/Layout";
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
