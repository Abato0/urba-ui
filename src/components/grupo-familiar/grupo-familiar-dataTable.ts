import { Column } from "react-table";
import { Data } from "../core/input/data";
import ActionsCell from "../table/actions-cell";

export const head = Object.freeze([
  {
    Header: "Nombre Familiar",
    accessor: "nombre_familiar",
  },
  {
    Header: "Celular",
    accessor: "celular",
  },
  {
    Header: "Manzana",
    accessor: "manzana",
  },
  {
    Header: "Villa",
    accessor: "villa",
  },
  {
    Header: "Calle",
    accessor: "calle",
  },
  {
    id: "actions",
    Cell: ActionsCell,
    padding: "none",
  },
] as Column<Data>[]);
