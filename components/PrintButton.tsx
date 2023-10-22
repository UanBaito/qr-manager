import { useRef } from "react";
import { FaPrint } from "react-icons/fa6";
import styles from "./PrintButton.module.scss";

export default function PrintButton({
  event_id,
  employee_id,
  has_printed_qr,
}: {
  event_id: string;
  employee_id: string;
  has_printed_qr: boolean | string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleClick() {
    if (!has_printed_qr) {
      window.open(`/qr?employeeID=${employee_id}&eventID=${event_id}`);
    }
    //  else {
    //   dialogRef.current.showModal();
    // }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!!has_printed_qr}
        className={styles.button}
      >
        <FaPrint className={styles.icon} />
      </button>

      {/* <dialog ref={dialogRef}>
        <h2>printed qr already</h2>
        <form method="dialog">
          <button>close</button>
        </form>
      </dialog> */}
    </>
  );
}
