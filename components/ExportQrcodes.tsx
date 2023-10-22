import { FaFileExport } from "react-icons/fa6";
import styles from "./ExportQrcodes.module.scss";
import { baseUrl } from "../lib/constants";

export default function ExportQrcodes({ eventID }: { eventID: string }) {
  return (
    <a
      className={styles.button}
      href={`${baseUrl}/api/qrcode?eventID=${eventID}`}
    >
      <FaFileExport className={styles.icon} />
    </a>
  );
}
