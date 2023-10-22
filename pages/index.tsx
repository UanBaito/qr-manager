import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import Image from "next/image";
import qrcode from "../public/qrcode.png";

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}></div>
      <ul>
        <li>
          <button>
            <figure>
              <Image src={qrcode} alt="" placeholder="blur" />
            </figure>
            <h2>Export QR codes</h2>
          </button>
        </li>
      </ul>
    </Layout>
  );
}
