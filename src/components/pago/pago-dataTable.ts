import { Column } from "react-table";
import VisualizarActionsCell from "../table/ver-imagen-cell";

export interface AllPagoTable {
  id: number;
  nombre_familiar: string;
  fecha_pago: string;
  tipo_aporte: string;
  descripcion: string;
  estado: string;
  monto: number;
  mes_ano_pago?: string;
}

export const headPagoTable = Object.freeze([
  {
    Header: "Nombre Familiar",
    accessor: "nombre_familiar",
  },

  {
    Header: "Nombre del Aporte",
    accessor: "nombre_aporte",
  },
  {
    Header: "Tipo del Aporte",
    accessor: "tipo_aporte",
  },

  {
    Header: "Fecha del Pago",
    accessor: "fecha_pago",
  },
  // {
  //   Header: "Mes del pago",
  //   accessor: "mes_ano_pago",
  // },
  {
    Header: "Descripcion",
    accessor: "descripcion",
  },
  {
    Header: "Monto",
    accessor: "monto",
  },
  {
    Header: "Estado",
    accessor: "status",
  },

  {
    id: "actions",
    Cell: VisualizarActionsCell,
    padding: "none",
  },
] as Column<AllPagoTable>[]);
