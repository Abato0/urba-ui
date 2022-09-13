import { Column } from 'react-table'
import ActionsCell from '../table/actions-cell'
import NombreGrupoFamiliarCell from './grupo-familiar-nombre-cell'

export const head = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Grupo Familiar',
        Cell: NombreGrupoFamiliarCell,
        // accessor: 'nombre_familiar',
    },
    {
        Header: 'Calle Principal',
        accessor: 'calle_principal',
    },
    {
        Header: 'Calle Interseccion',
        accessor: 'calle_interseccion',
    },
    {
        Header: 'Manzana',
        accessor: 'manzana',
    },
    {
        Header: 'Villa',
        accessor: 'villa',
    },
    // {
    //   Header: "Tipo de edificacion",
    //   accessor: "tipo_edificacion",
    // },
    // {
    //   Header: "Color",
    //   accessor: "color_fachada",
    // },
    {
        id: 'actions',
        Cell: ActionsCell,
        padding: 'none',
    },
] as Column<any>[])
