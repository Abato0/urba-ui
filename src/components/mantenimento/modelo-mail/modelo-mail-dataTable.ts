import { Column } from 'react-table'
import ActionsCell from '../../table/actions-cell'
import ActionsCellEditDelete from '../../table/actions-delete-edit'
import ActionsCellEditDeleteModeloMail from './modelo-mail-actions-buttons'

export const columnsModeloMail = Object.freeze([
    //   {
    //     Header: "ID",
    //     accessor: "id",
    //   },
    {
        Header: 'Categoria',
        accessor: 'categoria',
    },

    {
        Header: 'Remitente',
        accessor: 'remitente',
    },
    // {
    //     Header: 'Titulo',
    //     accessor: 'titulo',
    // },
    {
        Header: 'Asunto',
        accessor: 'asunto',
    },
    {
        Header: 'Texto Superior',
        accessor: 'textoSuperior',
    },
    {
        Header: 'Texto Inferior',
        accessor: 'textoInferior',
    },

    {
        Header: 'Firma',
        accessor: 'firma',
    },

    {
        id: 'actions',
        Cell: ActionsCellEditDeleteModeloMail,
        padding: 'none',
    },
] as Column<any>[])
