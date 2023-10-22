import { useMutation } from "@tanstack/react-query";
import styles from "./CreateQRcodes.module.scss";
import { baseUrl } from "../lib/constants";

export default function CreateQRcodes({ eventID }: { eventID: string }) {
  const qrcodesMutation = useMutation({
    mutationFn: async () => {
      const res = fetch(`${baseUrl}/api/qrcode`, {
        method: "PUT",
        body: JSON.stringify({ eventID: eventID }),
      });
    },
  });

  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          qrcodesMutation.mutate();
        }}
      >
        create qr codes
      </button>
    </div>
  );
}
