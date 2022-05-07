import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsManzana = Object.freeze([
    //   {
    //     Header: "ID",
    //     accessor: "id",
    //   },
    {
        Header: 'Manzana',
        accessor: 'manzana',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
