import Head from "next/head";
import styles from "../styles/home.module.scss";
import Layout from "../components/Layout";
import Image from "next/image";
import musicLogo from "../public/music_logo.png";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../lib/constants";

export default function Home() {
  useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/api/event`);
      return await res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <Layout>
      <section className={styles.container}>
        {/* <ul>
          <li>
            <button>
              <figure>
                <Image src={musicLogo} alt="" placeholder="blur" />
              </figure>
              <h2>Create New Event</h2>
            </button>
          </li>
        </ul> */}
      </section>
    </Layout>
  );
}
