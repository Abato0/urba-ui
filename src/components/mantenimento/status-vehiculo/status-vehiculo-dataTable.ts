import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'

export const columnsStatusVehiculo = Object.freeze([
    //   {
    //     Header: "ID",
    //     accessor: "id",
    //   },
    {
        Header: 'Status de Vehiculo',
        accessor: 'statusVehiculo',
    },
    {
        id: 'actions',
        Cell: ActionsCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
