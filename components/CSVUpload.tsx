import { useMutation, useQueryClient } from "@tanstack/react-query";
import "dotenv/config";
import { baseUrl } from "../lib/constants";
import styles from "./CSVUpload.module.scss";
import { FaUpload } from "react-icons/fa6";
import BeatLoader from "react-spinners/BeatLoader";
import { MutableRefObject, useEffect } from "react";

export default function CSVUpload({
  eventID,
  messageDivRef,
}: {
  eventID: string;
  messageDivRef: MutableRefObject<HTMLDivElement>;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (messageDivRef.current) {
      messageDivRef.current.classList.add(styles.message);
    }
  }, [messageDivRef.current]);

  async function handleSubmit(file: File) {
    if (file) {
      const text = await file.text();
      employeesMutation.mutate(text);
    }
  }

  const employeesMutation = useMutation({
    mutationFn: async (CSVtext: string) => {
      const res = await fetch(`${baseUrl}/api/employee`, {
        method: "POST",
        body: JSON.stringify({ CSVtext, eventID }),
      });
      if (!res.ok) {
        throw new Error("something went wrong");
      } else {
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      messageDivRef.current.classList.remove(styles.error);
      messageDivRef.current.textContent = "Lista actualizada";
      messageDivRef.current.classList.add(styles.success);
    },
    onError: () => {
      messageDivRef.current.classList.remove(styles.success);
      messageDivRef.current.textContent =
        "Hubo un problema al actualizar la lista";
      messageDivRef.current.classList.add(styles.error);
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleSubmit(e.target.files[0]);
  }

  return (
    <div className={styles.container}>
      {employeesMutation.isPending ? (
        <BeatLoader color="#6784c0" size={8} margin={0} />
      ) : (
        <>
          {employeesMutation.isError ? "" : null}

          {employeesMutation.isSuccess ? "" : null}

          <form method="post">
            <label htmlFor="file">
              <FaUpload className={styles.icon} />
            </label>
            <input
              id="file"
              type="file"
              name="file"
              onChange={handleChange}
              accept=".csv"
            />
          </form>
        </>
      )}
    </div>
  );
}
