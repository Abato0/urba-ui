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
    faImages,
} from '@fortawesome/free-solid-svg-icons'
import { IHeaderSidebar, IItemsSidebar } from '../components/layout/app-sidebar'
import { EnlacesSidebar } from './routes'
import { EstadoTagRow } from '../components/tag/use-tag'
import { IGrupoFamiliar } from '../interface/grupo-familiar.interface'
import { isEmpty } from 'ramda'

export const getFormatoGrupoFamiliar = (grupoFamiliar: IGrupoFamiliar) => {
    if (grupoFamiliar) {
        return `${grupoFamiliar.nombre_familiar}-${
            grupoFamiliar.manzana.manzana
        }${
            grupoFamiliar.extension && !isEmpty(grupoFamiliar.extension)
                ? `-${grupoFamiliar.villa}-${grupoFamiliar.extension}`
                : `-${grupoFamiliar.villa}`
        } `
    }
    return ''
}

export enum EEstadosTagVehiculo {
    ASIGNADO = 'ASIGNADO',
    LIBRE = 'LIBRE',
    REPOSICION = 'REPOSICION',
    PRIMERA_VEZ = 'PRIMERA_VEZ',
}

export const URL_BASE_API = (): string => {
    return process.env.NEXT_PUBLIC_BASE_API_UR ?? ''
}

export const moduloMigracionGeneral = [
    {
        label: 'Grupo Familiar',
        value: 1,
    },
    {
        label: 'Integrante de Grupo Familiar',
        value: 2,
    },
    {
        label: 'Vehiculo',
        value: 3,
    },
    {
        label: 'Usuario Operativo',
        value: 4,
    },
    {
        label: 'Usuario Morador',
        value: 5,
    },
]

export const moduloMigracionPagos = [
    {
        label: 'Implementación',
        value: 1,
    },
    {
        label: 'Mantenimiento',
        value: 2,
    },
    {
        label: 'TAG',
        value: 3,
    },
    {
        label: 'Otros',
        value: 4,
    },
]

export const moduloMigracionParametrizacion = [
    {
        label: 'Colores',
        value: 1,
    },
    {
        label: 'Calles y Peatonales',
        value: 2,
    },
    {
        label: 'Manzanas',
        value: 3,
    },
    {
        label: 'Marcas',
        value: 4,
    },
    {
        label: 'Modelos',
        value: 5,
    },
    {
        label: 'Valores de Tag',
        value: 6,
    },
    {
        label: 'Parentesco',
        value: 7,
    },
    {
        label: 'Tipo de Identificación',
        value: 8,
    },
]

export const publicPages = ['/login', 'recordar-contrasena']

export const ID_STATUS_TAG_DISPONIBLE = 1
export const ID_STATUS_TAG_INACTIVO = 2
export const ID_STATUS_TAG_OCUPADO = 3
export const ID_STATUS_TAG_ANULADO = 6

export const ID_VALOR_TAG_PRIMERA_VEZ = 1
export const ID_VALOR_TAG_RENOVACION = 2
export const ID_VALOR_REPOSICION = 3

export const COLOR_PRIMARIO = '#4e54c8'
export const COLOR_SECUDARIO = '#646cfd'

export enum LUGAR_IMAGEN {
    LOGIN = 'login',
    RECORDAD_PASSWORD = 'recordar-contrasena',
    HOME = 'home',
}

export const ListadoEstadoTagRow = [
    {
        label: 'Disponible',
        value: EstadoTagRow.DISPONIBLE,
    },
    {
        label: 'Ocupado',
        value: EstadoTagRow.OCUPADO,
    },
    {
        label: 'Inactivo',
        value: EstadoTagRow.INACTIVO,
    },
]

export const Listado_lugares_image = [
    {
        label: 'Login',
        value: LUGAR_IMAGEN.LOGIN,
    },
    {
        label: 'Recordar Contraseña',
        value: LUGAR_IMAGEN.RECORDAD_PASSWORD,
    },
    {
        label: 'Inicio',
        value: LUGAR_IMAGEN.HOME,
    },
]

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
                label: 'Listado de Integrantes de Grupos Familiares',
                ruta: String(EnlacesSidebar.integrante.listado.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Aportaciones',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Aportaciones',
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
                label: 'Listado de Aportaciones por Tag',
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
                label: 'Listado de Integrantes de Grupos Familiares',
                ruta: String(EnlacesSidebar.integrante.listado.route),
            },
        ],
    },
    {
        icon: faDonate,
        label: 'Aportaciones',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Aportaciones',
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

export const ItemsListadoOperador: IHeaderSidebar[] = [
    // {
    //     icon: faUsers,
    //     label: 'Grupos Familiares',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado de Grupos Familiares',
    //             ruta: String(EnlacesSidebar.grupoFamiliar.listado.route),
    //         },
    //     ],
    // },
    // {
    //     icon: faUser,
    //     label: 'Integrantes',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado de Integrantes Familiares',
    //             ruta: String(EnlacesSidebar.integrante.listado.route),
    //         },
    //     ],
    // },
    {
        icon: faDonate,
        label: 'Aportaciones',
        items: [
            {
                icon: faListAlt,
                label: 'Listado de Aportaciones',
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
]

export const ItemsOperacionesAdmin: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Asignación de Tag',
        ruta: String(EnlacesSidebar.tag.asignacionTag.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Envio de Correos',
        ruta: '/usuario/envio-correo',
    },
]

export const ItemsOperacionesMorador: IItemsSidebar[] = []

export const ItemOperacionesOperador: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Asignación de Tag',
        ruta: String(EnlacesSidebar.tag.asignacionTag.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Envio de Correos',
        ruta: '/usuario/envio-correo',
    },
]

export const newItemsRegistrosOperador: IItemsSidebar[] = [
    {
        icon: faDonate,
        label: 'Registrar grupo familiar',
        ruta: String(EnlacesSidebar.grupoFamiliar.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar integrante de grupo familiar',
        ruta: String(EnlacesSidebar.integrante.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar vehiculo',
        ruta: String(EnlacesSidebar.vehiculo.registrar.route),
    },
    {
        icon: faDonate,
        label: 'Registrar Aportación',
        ruta: String(EnlacesSidebar.pago.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar Tag',
        ruta: String(EnlacesSidebar.tag.registrar.route),
    },
]

export const newItemsRegistrosADMIN: IItemsSidebar[] = [
    {
        icon: faDonate,
        label: 'Registrar grupo familiar',
        ruta: String(EnlacesSidebar.grupoFamiliar.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar integrante de grupo familiar',
        ruta: String(EnlacesSidebar.integrante.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar vehiculo',
        ruta: String(EnlacesSidebar.vehiculo.registrar.route),
    },
    {
        icon: faDonate,
        label: 'Registrar Aportación',
        ruta: String(EnlacesSidebar.pago.registrar.route),
    },

    {
        icon: faListAlt,
        label: 'Registrar Tag',
        ruta: String(EnlacesSidebar.tag.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registro de Usuario',
        ruta: '/usuario/ingresar',
    },
    {
        icon: faListAlt,
        label: 'Registrar de Visitantes',
        ruta: String(EnlacesSidebar.visitante.ingresarMorador.route),
    },

    {
        icon: faListAlt,
        label: 'Registrar Entrada de Visitantes ',
        ruta: String(EnlacesSidebar.visitante.listadoVisitante.route),
    },
]

export const newItemsRegistrosMorador: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Registrar integrante de grupo familiar',
        ruta: String(EnlacesSidebar.integrante.registrar.route),
    },
    {
        icon: faListAlt,
        label: 'Registrar vehiculo',
        ruta: String(EnlacesSidebar.vehiculo.registrar.route),
    },
    {
        icon: faDonate,
        label: 'Registrar Aportación',
        ruta: String(EnlacesSidebar.pago.registrar.route),
    },

    {
        icon: faListAlt,
        label: 'Registrar de Visitantes',
        ruta: String(EnlacesSidebar.visitante.ingresarMorador.route),
    },
]

export const newItemsListadoSeguridad = [
    // {
    //     icon: faListAlt,
    //     label: 'Listado de Visitantes',
    //     ruta: String(EnlacesSidebar.visitante.listadoVisitante.route),
    // },
]

export const newItemsRegistroSeguridad = [
    {
        icon: faListAlt,
        label: 'Registro de Salida de Visitantes',
        ruta: String(EnlacesSidebar.visitante.listadoVisitante.route),
    },
]

export const newItemsListadoOperador: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Listado de Aportaciones',
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
    {
        icon: faListAlt,
        label: 'Listado de Vehiculos',
        ruta: String(EnlacesSidebar.vehiculo.listado.route),
    },
]

export const newItemsListadoAdmin: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Listado de Grupos Familiares',
        ruta: String(EnlacesSidebar.grupoFamiliar.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Integrantes de Grupos Familiares',
        ruta: String(EnlacesSidebar.integrante.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Aportaciones',
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
    {
        icon: faListAlt,
        label: 'Listado de Vehiculos',
        ruta: String(EnlacesSidebar.vehiculo.listado.route),
    },
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
    {
        icon: faListAlt,
        label: 'Listado de Visitantes',
        ruta: String(EnlacesSidebar.visitante.listadoVisitante.route),
    },
]

export const newItemsListadoMorador: IItemsSidebar[] = [
    // {
    //     icon: faListAlt,
    //     label: 'Listado de Grupos Familiares',
    //     ruta: String(EnlacesSidebar.grupoFamiliar.listado.route),
    // },
    {
        icon: faListAlt,
        label: 'Listado de Integrantes de Grupos Familiares',
        ruta: String(EnlacesSidebar.integrante.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Aportaciones',
        ruta: EnlacesSidebar.pago.listado.route,
    },
    // {
    //     icon: faListAlt,
    //     label: 'Cartera Vencida',
    //     ruta: String(EnlacesSidebar.pago.carteraVencida.route),
    // },
    {
        icon: faListAlt,
        label: 'Matriz de Aportaciones',
        ruta: String(EnlacesSidebar.pago.matrizOperaciones.route),
    },
    // {
    //     icon: faListAlt,
    //     label: 'Listado de Pago por Tag',
    //     ruta: String(EnlacesSidebar.tag.listado.route),
    // },
    {
        icon: faListAlt,
        label: 'Listado de Vehiculos',
        ruta: String(EnlacesSidebar.vehiculo.listado.route),
    },
]

export const ItemsRegistrosOperador: IHeaderSidebar[] = [
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
    // {
    //     icon: faDonate,
    //     label: 'Aportaciones',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Registrar Aportaciones',
    //             ruta: String(EnlacesSidebar.pago.registrar.route),
    //         },
    //     ],
    // },
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
    // {
    //     icon: faDonate,
    //     label: 'Tags',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Registrar Tag',
    //             ruta: String(EnlacesSidebar.tag.registrar.route),
    //         },
    //         {
    //             icon: faListAlt,
    //             label: 'Asignación de Tag',
    //             ruta: String(EnlacesSidebar.tag.asignacionTag.registrar.route),
    //         },
    //     ],
    // },
]

export const ItemsRegistrosMorador: IHeaderSidebar[] = [
    // {
    //     icon: faUsers,
    //     label: 'Grupos Familiares',
    //     items: [
    //         {
    //             icon: faEdit,
    //             label: 'Registrar grupo familiar',
    //             ruta: String(EnlacesSidebar.grupoFamiliar.registrar.route),
    //         },
    //     ],
    // },
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
    // {
    //     icon: faDonate,
    //     label: 'Aportaciones',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Registrar Aportación',
    //             ruta: String(EnlacesSidebar.pago.registrar.route),
    //         },
    //     ],
    // },
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

export const newItemsManeniminetoOperador: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Listado de Status de TAGS',
        ruta: String(EnlacesSidebar.mantenimiento.statustag.listado.route),
    },
]
export const newItemsMantenimientoAdmin: IItemsSidebar[] = [
    {
        icon: faListAlt,
        label: 'Listado de Actividades',
        ruta: String(EnlacesSidebar.mantenimiento.logs.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Colores',
        ruta: String(EnlacesSidebar.mantenimiento.colores.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de calles y peatonales',
        ruta: String(EnlacesSidebar.mantenimiento.calle.listado.route),
    },
    // {
    //     icon: faListAlt,
    //     label: 'Listado de visitante',
    //     ruta: String(EnlacesSidebar.visitante.listadoVisitante.route),
    // },
    {
        icon: faListAlt,
        label: 'Listado de manzanas',
        ruta: String(EnlacesSidebar.mantenimiento.manzana.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de marcas',
        ruta: String(EnlacesSidebar.mantenimiento.marca.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de modelos',
        ruta: String(EnlacesSidebar.mantenimiento.modelo.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de valores de TAGS',
        ruta: String(EnlacesSidebar.mantenimiento.valorTag.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Status de TAGS',
        ruta: String(EnlacesSidebar.mantenimiento.statustag.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de Parentescos',
        ruta: String(EnlacesSidebar.mantenimiento.parentesco.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de imagenes de bienvenida',
        ruta: String(EnlacesSidebar.mantenimiento.imagenesSitio.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Listado de tipos de identificaciones',
        ruta: String(
            EnlacesSidebar.mantenimiento.tipoIdentificacion.listado.route
        ),
    },
    {
        icon: faListAlt,
        label: 'Listado de modelos de correos',
        ruta: String(EnlacesSidebar.mantenimiento.modeloMail.listado.route),
    },
    {
        icon: faListAlt,
        label: 'Migración',
        ruta: String(EnlacesSidebar.mantenimiento.migracion.ingresar.route),
    },
]

export const ItemsMantenimientoOperador: IHeaderSidebar[] = [
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
        label: 'Calles y Peatonales',
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
    // {
    //     icon: faRoad,
    //     label: 'Status Vehiculo',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado',
    //             ruta: String(
    //                 EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
    //             ),
    //         },
    //     ],
    // },
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

    // {
    //     icon: faRoad,
    //     label: 'Status Vehiculo',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado',
    //             ruta: String(
    //                 EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
    //             ),
    //         },
    //     ],
    // },
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
        label: 'Calles y Peatonales',
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
    // {
    //     icon: faRoad,
    //     label: 'Status Vehiculo',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado',
    //             ruta: String(
    //                 EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
    //             ),
    //         },
    //     ],
    // },
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
        icon: faImages,
        label: 'Imagenes de Bienvenida',
        items: [
            {
                icon: faListAlt,
                label: 'Listado',
                ruta: String(
                    EnlacesSidebar.mantenimiento.imagenesSitio.listado.route
                ),
            },
        ],
    },

    // {
    //     icon: faRoad,
    //     label: 'Status Vehiculo',
    //     items: [
    //         {
    //             icon: faListAlt,
    //             label: 'Listado',
    //             ruta: String(
    //                 EnlacesSidebar.mantenimiento.statusVehiculo.listado.route
    //             ),
    //         },
    //     ],
    // },
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
