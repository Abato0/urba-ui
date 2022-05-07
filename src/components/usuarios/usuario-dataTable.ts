import { Column } from 'react-table'
import ActionsUsuarioCellEditDelete from './usuario-actions-buttons'

export const columnsUsuario = Object.freeze([
    {
        Header: 'Tipo de Usuario',
        accessor: 'tipo_usuario',
    },
    {
        Header: 'Usuario',
        accessor: 'user',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre_completo',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Telefono',
        accessor: 'telefono',
    },
    {
        id: 'actions',
        Cell: ActionsUsuarioCellEditDelete,
        padding: 'none',
    },
] as Column<any>[])
