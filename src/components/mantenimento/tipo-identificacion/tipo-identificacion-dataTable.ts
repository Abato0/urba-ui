import { Column } from "react-table";
import ActionsCell from "../../table/actions-cell";
import ActionsCellEditDelete from "../../table/actions-delete-edit";

export const columnsTipoIdentificacion = Object.freeze([
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Tipo de Identificación",
    accessor: "tipo_identificacion",
  },
  {
    id: "actions",
    Cell: ActionsCellEditDelete,
    padding: "none",
  },
] as Column<any>[]);
