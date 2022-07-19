import { Column } from 'react-table'
import ActionsCell from './cell-actions'

export const headImagen = Object.freeze([
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Lugar',
        accessor: 'lugar',
    },
    {
        id: 'actions',
        Cell: ActionsCell,
        padding: 'none',
    },
] as Column<any>[])
