import { Column } from "react-table";

export const columnsTags = Object.freeze([
  {
    Header: "Grupo Familiar",
    accessor: "nombre_familiar",
  },
  {
    Header: "Placa Vehiculo",
    accessor: "placa",
  },
  {
    Header: "Tipo Tag",
    accessor: "tipo_tag",
  },
  {
    Header: "Deposito",
    accessor: "monto",
  },
  {
    Header: "Fecha del Pago",
    accessor: "fecha_pago",
  },
] as Column<any>[]);
