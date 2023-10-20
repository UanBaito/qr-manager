import { FaFaceFrown } from "react-icons/fa6";
import style from "./EmployeesNotFound.module.scss";

export default function EmployeesNotFound() {
  return (
    <div className={style.container}>
      <FaFaceFrown size={60} />
      <span>Todavía no hay empleados asignados a este evento.</span>
    </div>
  );
}
