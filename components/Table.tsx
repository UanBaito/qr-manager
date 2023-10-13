import Link from "next/link";
import styles from "./Table.module.scss";

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
      columns.push(column);
    }
  }

  const columnsHead = columns.map((columnName) => {
    return <th key={"column-" + columnName}>{columnName}</th>;
  });

  return (
    <table className={styles.table}>
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
    if (column !== "id") {
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
        <Link href={viewEndpoint + data.id}>View</Link>
      </td>
    </tr>
  );
}
