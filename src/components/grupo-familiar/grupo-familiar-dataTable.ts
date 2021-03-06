import { Column } from 'react-table'
import { Data } from '../core/input/data'
import ActionsCell from '../table/actions-cell'

export const head = Object.freeze([
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
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
