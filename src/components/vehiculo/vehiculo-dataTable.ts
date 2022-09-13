import { Column } from 'react-table'
import ActionsCellVehiculo from './actions-cell-vehiculo'
import { IVehiculoVariableNormalize } from './use-vehiculo'

export interface AllPagoTable {
    id: number
    nombre_familiar: string
    fecha_pago: string
    tipo_aporte: string
    descripcion: string
    estado: string
    monto: number
    mes_ano_pago?: string
}

export const headVehiculoTable = Object.freeze([
    // {
    //   Header: "Tipo Vehiculo",
    //   accessor: "tipo_vehiculo",
    // },
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
    },

    {
        Header: 'Marca',
        accessor: 'marca',
    },

    {
        Header: 'Modelo',
        accessor: 'modelo',
    },

    {
        Header: 'Placa',
        accessor: 'placa',
    },

    {
        Header: 'Color',
        accessor: 'color',
    },

    {
        Header: 'Año',
        accessor: 'ano',
    },

    // {
    //     Header: 'Status',
    //     accessor: 'status',
    // },

    {
        id: 'actions',
        Cell: ActionsCellVehiculo,
        padding: 'none',
    },
] as Column<IVehiculoVariableNormalize>[])

export const headVehiculoActivacionTable = Object.freeze([
    // {
    //   Header: "ID",
    //   accessor: "id",
    // },
    // {
    //   Header: "Nombre Familiar",
    //   accessor: "nombre_familiar",
    // },
    // {
    //   Header: "Tipo Vehiculo",
    //   accessor: "tipo_vehiculo",
    // },
    {
        Header: 'Marca',
        accessor: 'marca',
    },

    {
        Header: 'Modelo',
        accessor: 'modelo',
    },

    {
        Header: 'Placa',
        accessor: 'placa',
    },

    {
        Header: 'Color',
        accessor: 'color',
    },

    {
        Header: 'Nombre Familiar',
        accessor: 'nombre_familiar',
    },
    {
        Header: 'Status',
        accessor: 'status',
    },
] as Column<IVehiculoVariableNormalize>[])
