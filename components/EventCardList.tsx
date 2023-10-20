import { useQuery } from "@tanstack/react-query";
import styles from "./EventCardList.module.scss";
import { baseUrl } from "../lib/constants";
import { useRouter } from "next/router";

export default function EventCardList() {
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/event`);

      if (res.status === 404) {
        throw new Error("Events not found", { cause: 404 });
      }
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return await res.json();
    },
  });

  if (eventsQuery.isLoading) {
    return <>loading</>;
  }
  if (eventsQuery.isError) {
    return <>error</>;
  }

  const eventsList = eventsQuery.data;

  const MappedEventsList = eventsList.map((event: event) => {
    event.created_at = new Date(event.created_at);
    return <EventCard event={event} key={event.id} />;
  });

  return <ul className={styles.list}>{MappedEventsList}</ul>;
}

export function EventCard({ event }: { event: event }) {
  const router = useRouter();
  function handleClick() {
    router.push(`/events/${event.id}`);
  }

  return (
    <li className={styles.card_item}>
      <button onClick={handleClick}>
        <div className={styles.card}>
          <figure>
            <img src="/music_logo.png" alt="Event logo"></img>
          </figure>
          <div className={styles.card_body}>
            <h2>{event.name}</h2>
          </div>
        </div>
      </button>
    </li>
  );
}
