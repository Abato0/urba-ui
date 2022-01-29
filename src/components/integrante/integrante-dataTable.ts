import { Column } from "react-table";
import { Data } from "../core/input/data";
import ActionsCell from "../table/actions-cell";

export const headIntegranteTable = Object.freeze([
  {
    Header: "Tipo de identificacion",
    accessor: "tipo_doc_identidad",
  },
  {
    Header: "Numero de Identificacion",
    accessor: "num_doc_identidad",
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
    Header: "Genero",
    accessor: "genero",
  },
  {
    Header: "Fecha de Nacimiento",
    accessor: "fecha_nacimiento",
  },
  {
    Header: "Telefono",
    accessor: "telefono",
  },
  {
    Header: "Email",
    accessor: "emnail",
  },
  {
    Header: "Familia",
    accessor: "nombre_familiar",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Calle Principal",
    accessor: "calle_principal",
  },
  {
    Header: "Calle Interseccion",
    accessor: "calle_interseccion",
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
    id: "actions",
    Cell: ActionsCell,
    padding: "none",
  },
] as Column<any>[]);
