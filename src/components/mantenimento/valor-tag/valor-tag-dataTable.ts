import { Column } from 'react-table'
import ActionsCellEditDeleteValoresTag from './actions-cells-valor-tag'

export const columnsValorTag = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Tipo de Tag',
        accessor: 'tipo_tag',
    },
    {
        Header: 'Valor',
        accessor: 'valor',
    },

    {
        id: 'actions',
        Cell: ActionsCellEditDeleteValoresTag,
        padding: 'none',
    },
] as Column<any>[])
