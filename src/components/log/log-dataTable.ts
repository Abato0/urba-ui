import { Column } from "react-table";

export const columnsLog = Object.freeze([
  // {
  //   Header: "Grupo Familiar",
  //   accessor: "nombre_familiar",
  // },
  {
    Header: "Usuario",
    accessor: "usuario",
  },
  {
    Header: "Rol",
    accessor: "tipoUsuario",
  },
  {
    Header: "Modulo",
    accessor: "modulo",
  },
  {
    Header: "Acción",
    accessor: "accion",
  },
  {
    Header: "Fecha",
    accessor: "fecha",
  },
] as Column<any>[]);
