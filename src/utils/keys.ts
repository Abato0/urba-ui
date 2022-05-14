import {
    faUsers,
    faListAlt,
    faUser,
    faDonate,
    faCar,
    faEdit,
    faFileSignature,
    faPalette,
    faRoad,
    faSquare,
    faBezierCurve,
    faCarCrash,
    faFileInvoiceDollar,
    faUsersCog,
    faIdCard,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { IHeaderSidebar, IItemsSidebar } from '../components/layout/app-sidebar'
import { EnlacesSidebar } from './routes'

export const URL_BASE_API = (): string => {
    return process.env.NEXT_PUBLIC_BASE_API_UR ?? ''
}

export const publicPages = ['/login', 'recordar-contrasena']

export const COLOR_PRIMARIO = '#4e54c8'
export const COLOR_SECUDARIO = '#646cfd'

export const ItemsListadoAdmin: IHeaderSidebar[] = [
    {
        icon: faUsers,
        label: 'Grupos Familiares',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Grupos Familiares',
                ruta: String(EnlacesSidebar.grupoFamiliar.listado.route),
            },
        ],
    },
    {
        icon: faUser,
        label: 'Integrantes',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Integrantes Familiares',
                ruta: String(EnlacesSidebar.integrante.listado.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Pagos',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Pagos',
                ruta: EnlacesSidebar.pago.listado.route,
            },
            {
                icon: faListAlt,
                label: 'Cartera Vencida',
                ruta: String(EnlacesSidebar.pago.carteraVencida.route),
            },
            {
                icon: faListAlt,
                label: 'Matriz de Aportaciones',
                ruta: String(EnlacesSidebar.pago.matrizOperaciones.route),
            },
            {
                icon: faListAlt,
                label: 'Listado de Pago por Tag',
                ruta: String(EnlacesSidebar.tag.listado.route),
            },
        ],
    },
    {
        icon: faCar,
        label: 'Vehiculos',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Vehiculos',
                ruta: String(EnlacesSidebar.vehiculo.listado.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Tags',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Tags',
                ruta: String(EnlacesSidebar.tag.listadoTag.route),
            },
            {
                icon: faListAlt,
                label: 'Listado de asignación de Tag',
                ruta: String(EnlacesSidebar.tag.asignacionTag.listado.route),
            },
        ],
    },
]

export const ItemsListadoMorador: IHeaderSidebar[] = [
    {
        icon: faUsers,
        label: 'Grupos Familiares',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Grupos Familiares',
                ruta: String(EnlacesSidebar.grupoFamiliar.listado.route),
            },
        ],
    },
    {
        icon: faUser,
        label: 'Integrantes',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Integrantes Familiares',
                ruta: String(EnlacesSidebar.integrante.listado.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Pagos',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Pagos',
                ruta: EnlacesSidebar.pago.listado.route,
            },
            {
                icon: faListAlt,
                label: 'Cartera Vencida',
                ruta: String(EnlacesSidebar.pago.carteraVencida.route),
            },
            {
                icon: faListAlt,
                label: 'Matriz de Aporteciones',
                ruta: String(EnlacesSidebar.pago.matrizOperaciones.route),
            },
            {
                icon: faListAlt,
                label: 'Listado de Pago por Tag',
                ruta: String(EnlacesSidebar.tag.listado.route),
            },
        ],
    },
    {
        icon: faCar,
        label: 'Vehiculos',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Vehiculos',
                ruta: String(EnlacesSidebar.vehiculo.listado.route),
            },
        ],
    },
]

export const ItemsRegistrosADMIN: IHeaderSidebar[] = [
    {
        icon: faUsers,
        label: 'Grupos Familiares',
        items: [
            {
                icon: faEdit,
                label: 'Registrar grupo familiar',
                ruta: String(EnlacesSidebar.grupoFamiliar.registrar.route),
            },
        ],
    },
    {
        icon: faUser,
        label: 'Integrantes',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar integrante familiar',
                ruta: String(EnlacesSidebar.integrante.registrar.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Pagos',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar pago',
                ruta: String(EnlacesSidebar.pago.registrar.route),
            },
        ],
    },
    {
        icon: faCar,
        label: 'Vehiculos',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar vehiculo',
                ruta: String(EnlacesSidebar.vehiculo.registrar.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Tags',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar Tag',
                ruta: String(EnlacesSidebar.tag.registrar.route),
            },
            {
                icon: faListAlt,
                label: 'Asignación de Tag',
                ruta: String(EnlacesSidebar.tag.asignacionTag.registrar.route),
            },
        ],
    },
]

export const ItemsRegistrosMorador: IHeaderSidebar[] = [
    {
        icon: faUsers,
        label: 'Grupos Familiares',
        items: [
            {
                icon: faEdit,
                label: 'Registrar grupo familiar',
                ruta: String(EnlacesSidebar.grupoFamiliar.registrar.route),
            },
        ],
    },
    {
        icon: faUser,
        label: 'Integrantes',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar integrante familiar',
                ruta: String(EnlacesSidebar.integrante.registrar.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Pagos',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar pago',
                ruta: String(EnlacesSidebar.pago.registrar.route),
            },
        ],
    },
    {
        icon: faCar,
        label: 'Vehiculos',
        items: [
            {
                icon: faListAlt,
                label: 'Registrar vehiculo',
                ruta: String(EnlacesSidebar.vehiculo.registrar.route),
            },
        ],
    },
]

export const ItemsMantenimientoAdmin: IHeaderSidebar[] = [
    {
        icon: faFileSignature,
        label: 'Logs',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Actividades',
                ruta: String(EnlacesSidebar.mantenimiento.logs.listado.route),
            },
        ],
    },
    {
        icon: faPalette,
        label: 'Colores',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.colores.listado.route
                ),
            },
        ],
    },
    {
        icon: faRoad,
        label: 'Calle',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(EnlacesSidebar.mantenimiento.calle.listado.route),
            },
        ],
    },
    {
        icon: faSquare,
        label: 'Manzana',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.manzana.listado.route
                ),
            },
        ],
    },
    {
        icon: faBezierCurve,
        label: 'Marca',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(EnlacesSidebar.mantenimiento.marca.listado.route),
            },
        ],
    },

    {
        icon: faCarCrash,
        label: 'Modelo',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(EnlacesSidebar.mantenimiento.modelo.listado.route),
            },
        ],
    },
    {
        icon: faRoad,
        label: 'Status Vehiculo',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
                ),
            },
        ],
    },
    {
        icon: faFileInvoiceDollar,
        label: 'Valor Tag',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.valorTag.listado.route
                ),
            },
        ],
    },
    {
        icon: faUsersCog,
        label: 'Parentesco',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.parentesco.listado.route
                ),
            },
        ],
    },

    {
        icon: faRoad,
        label: 'Status Vehiculo',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
                ),
            },
        ],
    },
    {
        icon: faIdCard,
        label: 'Tipo de identificación',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.tipoIdentificacion.listado
                        .route
                ),
            },
        ],
    },
    {
        icon: faEnvelope,
        label: 'Modelo del correo',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.modeloMail.listado.route
                ),
            },
        ],
    },
]

export const ItemUsuarioAdmin: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Registro de Usuario',
        ruta: '/usuario/ingresar',
    },
    {
        icon: faListAlt,
        label: 'Envio de Correos',
        ruta: '/usuario/envio-correo',
    },
]
