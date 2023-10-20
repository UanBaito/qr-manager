import Link from "next/link";
import styles from "./Navbar.module.scss";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href={"/"} className={pathname === "/" ? styles.active : ""}>
            Inicio
          </Link>
        </li>
        <li>
          <Link
            href={"/events"}
            className={
              pathname.includes("/events") === true ? styles.active : ""
            }
          >
            Eventos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
