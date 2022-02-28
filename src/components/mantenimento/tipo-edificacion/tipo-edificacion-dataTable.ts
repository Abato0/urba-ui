import { Column } from "react-table";
import ActionsCell from "../../table/actions-cell";
import ActionsCellEditDelete from "../../table/actions-delete-edit";

export const columnsTipoEdificacion = Object.freeze([
//   {
//     Header: "ID",
//     accessor: "id",
//   },
  {
    Header: "Tipo de Edificacion",
    accessor: "tipo_edificacion",
  },
  {
    id: "actions",
    Cell: ActionsCellEditDelete,
    padding: "none",
  },
] as Column<any>[]);
