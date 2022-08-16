import { Column } from 'react-table'
import VisualizarActionsCell from '../table/ver-imagen-cell'
import MontoPago from './montoPago'

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
        Header: 'Cuota / Mes',
        accessor: 'fecha_pago',
    },

    {
        Header: 'Fecha del Regitro del Pago',
        accessor: 'fecha_subida',
    },

    {
        // Header: 'Fecha del Recibo',

        Header: 'Fecha del Pago',
        accessor: 'fecha_recibo',
    },

    // {
    //   Header: "Mes del pago",
    //   accessor: "mes_ano_pago",
    // },
    {
        Header: 'Código de Recibo',
        accessor: 'cod_recibo',
    },
    {
        Header: 'Monto',
        Cell: MontoPago,
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
