import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsCalle = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Calle',
        accessor: 'calle',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
