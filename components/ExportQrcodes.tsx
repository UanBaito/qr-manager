import { FaFileExport } from "react-icons/fa6";
import styles from "./ExportQrcodes.module.scss";
import { baseUrl } from "../lib/constants";

export default function ExportQrcodes({ eventID }: { eventID: string }) {
  async function handleClick() {
    const res = await fetch(`${baseUrl}/api/qrcode?eventID=${eventID}`);
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    const result = await res.json();
    console.log(result);
  }
  return (
    <button className={styles.button} onClick={handleClick}>
      <FaFileExport className={styles.icon} />
    </button>
  );
}
