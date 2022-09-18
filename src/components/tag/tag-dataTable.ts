import { Column } from 'react-table'
import ActionsCellDesvincular from '../core/actions/actionsButtoonOnDesvincular'
import ActionsCellEditDelete from '../table/actions-delete-edit'
import ActionsCellEditDeleteTag from './actions-cell-tag'

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
        Header: 'Aportación',
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

    {
        Header: 'Ultima afiliación registrada',
        accessor: 'ultimoPago',
    },
    {
        id: 'actions',
        Cell: ActionsCellDesvincular,
        padding: 'none',
    },
] as Column<any>[])

export const columnsListadoTags = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
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
        Cell: ActionsCellEditDeleteTag,
        padding: 'none',
    },
] as Column<any>[])
