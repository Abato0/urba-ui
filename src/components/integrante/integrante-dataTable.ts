import { Column } from "react-table";
import { Data } from "../core/input/data";
import ActionsCell from "../table/actions-cell";

export const headIntegranteTable = Object.freeze([
  {
    Header: "Cedula",
    accessor: "cedula",
  },
  {
    Header: "Nombre",
    accessor: "nombre",
  },
  {
    Header: "Apellido",
    accessor: "apellido",
  },
  {
    Header: "Fecha de Nacimiento",
    accessor: "fecha_nacimiento",
  },
  {
    Header: "Familia",
    accessor: "nombre_familiar",
  },
  {
    Header: "Parentesco",
    accessor: "parentesco",
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
] as Column<any>[]);
