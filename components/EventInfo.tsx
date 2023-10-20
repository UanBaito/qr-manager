import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../lib/constants";
import Image from "next/image";
import styles from "./EventInfo.module.scss";
import NotFound from "./NotFound";

export default function EventInfo({ eventID }: { eventID: string }) {
  const eventQuery = useQuery({
    queryKey: ["event", eventID],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/event?eventID=${eventID}`);
      if (!response.ok) {
        throw new Error("Algo salió mal");
      } else {
        const result: event[] = await response.json();
        if (result.length === 0) {
          throw new Error("Evento no encontrado");
        }
        return result;
      }
    },
  });

  let EventInfo: event;
  if (!eventQuery.isLoading && !eventQuery.isError) {
    EventInfo = eventQuery.data[0];
  }

  ///TODO add not found state
  return (
    <div
      className={
        eventQuery.isLoading
          ? styles.placeholder
          : eventQuery.isError
          ? styles.error
          : styles.container
      }
    >
      {eventQuery.isLoading ? null : eventQuery.isError ? (
        <NotFound message={eventQuery.error.message} />
      ) : (
        <>
          <h1>{EventInfo.name}</h1>
          <Image
            src={"/music_logo.png"}
            width={200}
            height={130}
            alt="Event logo"
          ></Image>
        </>
      )}
    </div>
  );
}
