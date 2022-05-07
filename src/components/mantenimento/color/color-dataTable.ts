import { Column } from 'react-table'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsColor = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Color',
        accessor: 'color',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
