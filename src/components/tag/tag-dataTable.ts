import { Column } from 'react-table'
import ActionsCellEditDelete from '../table/actions-delete-edit'

export const columnsTags = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
    },
    {
        Header: ' Vehiculo',
        accessor: 'placa',
    },
    {
        Header: 'Tipo Tag',
        accessor: 'tipo_tag',
    },
    {
        Header: 'Deposito',
        accessor: 'monto',
    },
    {
        Header: 'Fecha del Pago',
        accessor: 'fecha_pago',
    },
] as Column<any>[])

export const columnsTagVehiculo = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
    },
    {
        Header: 'Tag',
        accessor: 'code',
    },
    {
        Header: ' Placa',
        accessor: 'placa',
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
        Header: 'Color',
        accessor: 'color',
    },
] as Column<any>[])

export const columnsListadoTags = Object.freeze([
    // {
    //   Header: "ID",
    //   accessor: "id",
    // },
    {
        Header: ' Codigo',
        accessor: 'code',
    },
    {
        Header: 'Estado',
        accessor: 'estado',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
