import { Column } from 'react-table'
import { IVisianteMoradorNormalize } from '../../pages/visitantes/listado-morador'
import ActionsCell from '../table/actions-cell'
import ActionsCellMorador from './actions-cells-morador'
import ActionsCellVisitante from './actions-cells-visitante'

export const columnsVisitanteMorador = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_grupo_familiar',
    },
    {
        Header: ' Visitante',
        accessor: 'nombre_visitante',
    },
    {
        Header: 'Fecha de Visita',
        accessor: 'fecha_visita',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
    {
        Header: 'Dirección',
        accessor: 'direccion',
    },
    {
        id: 'actions',
        Cell: ActionsCellMorador,
        padding: 'none',
    },
] as Column<any>[])

export const columnsVisitante = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_grupo_familiar',
    },
    {
        Header: 'Idenificación Visitante',
        accessor: 'identificacion_visitante',
    },
    {
        Header: ' Visitante',
        accessor: 'nombre_visitante',
    },

    {
        Header: 'Vehiculo',
        accessor: 'placa_vehiculo',
    },
    {
        Header: 'Fecha de Visita',
        accessor: 'fecha_visita',
    },
    {
        Header: 'Fecha de Llegada',
        accessor: 'fecha_llegada',
    },
    {
        Header: 'Fecha de Salida',
        accessor: 'fecha_salida',
    },
    {
        Header: 'Motivo de la visita',
        accessor: 'descripcion',
    },
    {
        Header: 'Dirección',
        accessor: 'direccion',
    },

    {
        id: 'actions',
        Cell: ActionsCellVisitante,
        padding: 'none',
    },
] as Column<IVisianteMoradorNormalize>[])
