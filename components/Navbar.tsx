import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/employees"}>Employees</Link>
        </li>
        <li>
          <Link href={"/events"}>Events</Link>
        </li>
      </ul>
    </nav>
  );
}
