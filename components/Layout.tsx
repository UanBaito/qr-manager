import { Suspense } from "react";
import styles from "./Layout.module.scss";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Suspense>
      <>
        <header>
          <Navbar />
        </header>
        <main className={styles.container}>{children}</main>
      </>
    </Suspense>
  );
}
