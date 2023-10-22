import { FaFileExport } from "react-icons/fa6";
import styles from "./ExportQrcodes.module.scss";

export default function ExportQrcodes() {
  return (
    <div className={styles.container}>
      <FaFileExport className={styles.icon} />
    </div>
  );
}
