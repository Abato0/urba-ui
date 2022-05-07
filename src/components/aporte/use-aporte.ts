import { useMutation, useQuery } from '@apollo/client'
import { equals, isNil } from 'ramda'
import {
    arrIntervaloFechaAporte,
    listarAportes,
    saveAporte,
} from './aporte-typedefs'

export interface IAporteVariables {
    id: number
    cuotas: number
    fecha_inicio: string
    fecha_fin: string
    nombre_aporte: string
    tipo_aporte: string
    valor_mensual: number
}

interface IOutput {
    code: number
    message: String
}

export interface IPostAporteData {
    PostAporte: IOutput
}

export const usePostAporteMutation = () => {
    const [mutate, { data, loading, error }] = useMutation<any>(saveAporte)
    return [mutate, data, loading, error]
}

export interface ListaAportes {
    ListaAportes: IAporteVariables[]
}

export const useListarAporteQuery = () => {
    return useQuery<ListaAportes>(listarAportes)
}

export const useArrIntervaloFechaAporte = (id: number | undefined) => {
    return useQuery<string[]>(arrIntervaloFechaAporte, {
        skip: equals(id, 0) || isNil(id),
    })
}
