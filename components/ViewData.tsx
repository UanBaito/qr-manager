import Link from "next/link";

export default function ViewData({
  viewEndpoint,
  id,
}: {
  viewEndpoint: string;
  id: string;
}) {
  return <Link href={viewEndpoint + id}>View</Link>;
}
