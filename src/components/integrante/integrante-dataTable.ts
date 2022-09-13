import { Column } from 'react-table'
import ActionsCell from '../table/actions-cell'
import RepresentanteCells from './representanteCell'

export const headIntegranteTable = Object.freeze([
    {
        Header: 'ID',
        accessor: 'id',
    },
    {
        Header: 'Grupo Familiar',
        accessor: 'nombre_familiar',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Apellido',
        accessor: 'apellido',
    },
    {
        Header: 'Tipo de identificación',
        accessor: 'tipo_doc_identidad',
    },
    {
        Header: 'Numero de Identificación',
        accessor: 'num_doc_identidad',
    },

    {
        Header: 'Genero',
        accessor: 'genero',
    },
    {
        Header: 'Fecha de Nacimiento',
        accessor: 'fecha_nacimiento',
    },
    {
        Header: 'Telefono',
        accessor: 'telefono',
    },
    {
        Header: 'Email',
        accessor: 'email',
    },
    {
        Header: 'Parentesco',
        accessor: 'parentesco',
    },
    {
        Header: 'Representante',
        // accessor: 'representante',
        Cell: RepresentanteCells,
    },

    // {
    //   Header: "Calle Principal",
    //   accessor: "calle_principal",
    // },
    // {
    //   Header: "Calle Interseccion",
    //   accessor: "calle_interseccion",
    // },
    // {
    //   Header: "Manzana",
    //   accessor: "manzana",
    // },
    // {
    //   Header: "Villa",
    //   accessor: "villa",
    // },

    {
        id: 'actions',
        Cell: ActionsCell,
        padding: 'none',
    },
] as Column<any>[])
