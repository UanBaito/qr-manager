import { FaFaceFrown } from "react-icons/fa6";
import style from "./NotFound.module.scss";

export default function NotFound({ message }: { message: string }) {
  return (
    <div className={style.container}>
      <FaFaceFrown size={60} />
      <span>{message}</span>
    </div>
  );
}
