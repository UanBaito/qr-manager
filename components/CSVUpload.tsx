import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function CSVUpload({ eventID }: { eventID: string }) {
  const [file, setFile] = useState<File>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log(file);
    e.preventDefault();

    if (file) {
      const text = await file.text();
      employeesMutation.mutate(text);
    }
  }

  const employeesMutation = useMutation({
    mutationFn: async (CSVtext: string) => {
      const res = await fetch("http://localhost:3000/api/employee", {
        method: "POST",
        body: JSON.stringify({ CSVtext, eventID }),
      });
      if (!res.ok) {
        throw new Error("something went wrong");
      }
      const result = res.json();
      return result;
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="file">Choose file to upload</label>
        <input type="file" name="file" onChange={handleChange} accept=".csv" />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
