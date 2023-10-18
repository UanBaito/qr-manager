import Link from "next/link";
import styles from "./Table.module.scss";

export default function Table({
  data,
  title,
  viewEndpoint,
}: {
  data: any[];
  title: string;
  viewEndpoint: string;
}) {
  const dataRows = data.map((dataRow) => {
    return (
      <TableRow data={dataRow} key={dataRow.id} viewEndpoint={viewEndpoint} />
    );
  });

  const columns = [];
  for (const column in data[0]) {
    if (column !== "id") {
      if (column === "has_printed_qr") {
        columns.push("¿Ha imprimido el código QR?");
      } else if (column === "name") {
        columns.push("Nombre");
      } else if (column === "print") {
        columns.push("Imprimir");
      } else if (column === "created_at") {
      } else if (column === "cedula") {
        columns.push("Cédula");
      } else if (column === "permission") {
        columns.push("Acceso");
      } else {
        columns.push(column);
      }
    }
  }

  const columnsHead = columns.map((columnName) => {
    return <th key={"column-" + columnName}>{columnName}</th>;
  });

  return (
    <table className={styles.table}>
      <caption>{title}</caption>
      <thead>
        <tr>{columnsHead}</tr>
      </thead>
      <tbody>{dataRows}</tbody>
    </table>
  );
}

export function TableRow({
  data,
  viewEndpoint,
}: {
  data: any;
  viewEndpoint: string;
}) {
  const cells = [];
  for (const column in data) {
    if (column === "id" || column === "created_at") {
    } else {
      cells.push(data[column]);
    }
  }

  const mappedCells = cells.map((cells) => {
    return <td key={"cell-" + cells}>{cells}</td>;
  });
  return (
    <tr>
      {mappedCells}
      <td>
        <Link href={viewEndpoint + data.id}>Ver</Link>
      </td>
    </tr>
  );
}
