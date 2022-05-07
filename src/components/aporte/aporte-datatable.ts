import { Column } from 'react-table'
export const headAporteTable = Object.freeze([
    {
        Header: 'Nombre Aporte',
        accessor: 'nombre_aporte',
    },

    {
        Header: 'Tipo del Aporte',
        accessor: 'tipo_aporte',
    },

    {
        Header: 'Cuotas',
        accessor: 'cuotas',
    },
    {
        Header: 'Valor mensual',
        accessor: 'valor_mensual',
    },
    {
        Header: 'Fecha inicio',
        accessor: 'fecha_inicio',
    },
    {
        Header: 'Fecha Fin',
        accessor: 'fecha_fin',
    },
    // {
    //   id: "actions",
    //   Cell: VisualizarActionsCell,
    //   padding: "none",
    // },
] as Column<any>[])
