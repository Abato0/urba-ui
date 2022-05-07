import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsParentesco = Object.freeze([
    //   {
    //     Header: "ID",
    //     accessor: "id",
    //   },
    {
        Header: 'Parentesco',
        accessor: 'parentesco',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
