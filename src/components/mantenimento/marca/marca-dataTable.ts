import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsMarca = Object.freeze([
    //   {
    //     Header: "ID",
    //     accessor: "id",
    //   },
    {
        Header: 'Marca',
        accessor: 'marca',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
