import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href={"/"}>Inicio</Link>
        </li>
        <li>
          <Link href={"/events"}>Eventos</Link>
        </li>
      </ul>
    </nav>
  );
}
