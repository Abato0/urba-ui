import { Column } from 'react-table'
import VisualizarActionsCell from '../table/ver-imagen-cell'

export interface AllPagoTable {
    id: number
    nombre_familiar: string
    tipo_pago: string
    fecha_pago: string
    fecha_subida: string
    descripcion: string
    monto: number
}

export const headPagoTable = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
    },

    // {
    //   Header: "Nombre del Aporte",
    //   accessor: "nombre_aporte",
    // },
    {
        Header: 'Tipo de Pago',
        accessor: 'tipo_pago',
    },

    {
        Header: 'Fecha del Pago',
        accessor: 'fecha_pago',
    },

    {
        Header: 'Fecha del Recibo',
        accessor: 'fecha_recibo',
    },

    // {
    //   Header: "Mes del pago",
    //   accessor: "mes_ano_pago",
    // },
    {
        Header: 'Descripcion',
        accessor: 'descripcion',
    },
    {
        Header: 'Monto',
        accessor: 'monto',
    },
    // {
    //   Header: "Estado",
    //   accessor: "status",
    // },

    {
        id: 'actions',
        Cell: VisualizarActionsCell,
        padding: 'none',
    },
] as Column<AllPagoTable>[])
