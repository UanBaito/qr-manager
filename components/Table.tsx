import Link from "next/link";
import styles from "./Table.module.scss";
import CSVUpload from "./CSVUpload";
import { FaEye } from "react-icons/fa6";

export default function Table({
  data,
  viewEndpoint,
}: {
  data: any[];

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
    <div className={styles.container}>
      <div className={styles.table_title_container}>
        <h2>Empleados asignados a este evento</h2>
      </div>
      <table>
        <thead>
          <tr>{columnsHead}</tr>
        </thead>
        <tbody>{dataRows}</tbody>
      </table>
    </div>
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
        <Link href={viewEndpoint + data.id}>
          <FaEye size={22} />
        </Link>
      </td>
    </tr>
  );
}
