import { Column } from 'react-table'
import ActionsUsuarioCellEditDelete from './usuario-actions-buttons'

export const columnsUsuario = Object.freeze([
    {
        Header: 'Nombre',
        accessor: 'nombre_completo',
    },
    {
        Header: 'Tipo de Usuario',
        accessor: 'tipo_usuario',
    },
    {
        Header: 'Usuario',
        accessor: 'user',
    },

    // {
    //     Header: 'Email',
    //     accessor: 'email',
    // },
    {
        Header: 'Grupo Familiar',
        accessor: 'grupoFamiliar',
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
