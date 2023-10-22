import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./CreateQRcodes.module.scss";
import { baseUrl } from "../lib/constants";
import { FaQrcode } from "react-icons/fa6";

export default function CreateQRcodes({ eventID }: { eventID: string }) {
  const queryClient = useQueryClient();

  const qrcodesMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${baseUrl}/api/qrcode`, {
        method: "PUT",
        body: JSON.stringify({ eventID: eventID }),
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          qrcodesMutation.mutate();
        }}
      >
        <FaQrcode className={styles.icon} />
      </button>
    </div>
  );
}
