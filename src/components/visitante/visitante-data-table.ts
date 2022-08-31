import { Column } from 'react-table'
import ActionsCell from '../table/actions-cell'

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
        Cell: ActionsCell,
        padding: 'none',
    },
] as Column<any>[])
