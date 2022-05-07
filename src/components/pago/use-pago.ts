import { useMutation, useQuery } from '@apollo/client'
import {
    carteraVencida,
    getPagoFamiliar,
    getPagoFamiliarFilter,
    listadoPago,
    matrizOperaciones,
    pagosDashboard,
    savePago,
    subirFoto,
} from './pago-typedefs'
import { isNil, isEmpty, equals } from 'ramda'
import { AllPago } from '../../interface/pago.interface'

export interface TipoPagoDashboard {
    monto: number
    fecha: string
}

export interface PagoDashboardResult {
    implementacion: TipoPagoDashboard[]
    mantenimiento: TipoPagoDashboard[]
    tag: TipoPagoDashboard[]
    otros: TipoPagoDashboard[]
    fechas: string[]
}

export interface IPagoDashboardQuery {
    ListadoPagosDashboard: PagoDashboardResult
}

export const usePagosDashboard = (fechaDesde: string, fechaHasta: string) => {
    return useQuery<IPagoDashboardQuery>(pagosDashboard, {
        // skip:
        //     isNil(fechaDesde) ||
        //     isEmpty(fechaHasta) ||
        //     isNil(fechaDesde) ||
        //     isEmpty(fechaHasta),
        variables: {
            fechaDesde,
            fechaHasta,
        },
    })
}

export const usePostPago = () => {
    const [mutate, { data, loading, error }] = useMutation(savePago, {
        refetchQueries: [
            { query: listadoPago },
            { query: getPagoFamiliarFilter },
        ],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useSubirFoto = () => {
    const [mutate, { data, loading, error }] = useMutation(subirFoto)
    return [mutate, data, loading, error]
}

interface ListaPagos {
    ListaPagos: AllPago[]
}

export const useAllListadoPago = () => {
    return useQuery<ListaPagos>(listadoPago)
}

interface ListaPagos {
    GetPagoFamiliar: AllPago
}

export const usePagoFamiliar = (id: number) => {
    return useQuery<ListaPagos>(getPagoFamiliar, {
        skip: id === 0,
        variables: {
            id,
        },
    })
}

export interface IPagoGrupoFamiliarInput {
    idGrupoFamiliar?: number
    // id_aporte?: number;
    mes?: string
    anio?: number
    tipo_pago?: String
}

interface IPagoGrupoFamiliarFiltersFunc {
    ListaPagoFamiliarFilter: IDataListaPagoFilter[]
}

export interface IDataListaPagoFilter {
    id: number
    grupoFamiliar: {
        nombre_familiar: string
    }
    pago: {
        tipo_pago: string
        fecha_pago: string
        fecha_subida: string
        descripcion: string
        monto: number
        fecha_recibo: string
    }
    // aporte: {
    //   nombre_aporte: string;
    //   tipo_aporte: string;
    // };
}

export interface IArrKeyData {
    keys: string[]
    data: string[]
}

export interface ICarteraVencidaQuery {
    CarteraVencida: IArrKeyData
}

export interface IMatrizOperacionesQuery {
    MatrizOperaciones: IArrKeyData
}

export const usePagoFamiliarFilters = (input: IPagoGrupoFamiliarInput) => {
    //console.log("Input: ", input);
    return useQuery<IPagoGrupoFamiliarFiltersFunc, IPagoGrupoFamiliarInput>(
        getPagoFamiliarFilter,
        {
            variables: {
                ...input,
            },
            skip: equals(input, {
                mes: '',
                idGrupoFamiliar: 0,
                anio: 0,
                tipo_pago: '',
                // id_aporte: 0,
            }),
            // skip: isEmpty(input),
        }
    )
}

export const useCarteraVencida = (fecha: string) => {
    return useQuery<ICarteraVencidaQuery>(carteraVencida, {
        skip: isNil(fecha) || isEmpty(fecha),
        variables: {
            fecha,
        },
    })
}

export const useMatrizOperaciones = (
    fechaDesde: string,
    fechaHasta: string
) => {
    return useQuery<IMatrizOperacionesQuery>(matrizOperaciones, {
        skip:
            isNil(fechaDesde) ||
            isEmpty(fechaHasta) ||
            isNil(fechaDesde) ||
            isEmpty(fechaHasta),
        variables: {
            fechaDesde,
            fechaHasta,
        },
    })
}
