import { useMutation, useQuery } from '@apollo/client'
import { IGrupoFamiliar } from '../../interface/grupo-familiar.interface'
import { isNilOrEmpty } from '../../utils/is-nil-empty'
import { IListadoGrupoFamiliarVariables } from '../grupo-familiar/use-grupo-familia'
import {
    deleteVisitante,
    getVisitante,
    getVisitanteMorador,
    listadoVisitante,
    listadoVisitanteMorador,
    postLlegadaVisitante,
    putLlegadoVisiante,
    salidaVisitante,
    saveVisitanteMorador,
    updateVisitanteMorador,
} from './visitante-typedef'

export interface IVisitanteMoradorVariables {
    id?: number
    grupoFamiliar: IGrupoFamiliar
    nombre_visitante: string
    descripcion: string
    fecha_visita: string
}

export interface IVisitanteVariables {
    id?: number
    grupoFamiliar: IGrupoFamiliar
    identificacion_visitante: string
    placa_vehiculo: string
    nombre_visitante: string
    descripcion: string
    fecha_visita: string
    fecha_llegada: string
}

export interface IListadoVisitanteMoradorQuery {
    ListadoVisitante: IVisitanteMoradorVariables[]
}

export interface IGetVisitanteMoradorQuery {
    GetVisitante: IVisitanteMoradorVariables
}

export interface IListadoVisitanteQuery {
    ListadoVisitante: IVisitanteVariables[]
}

export interface IGetVisitanteQuery {
    GetVisitante: IVisitanteMoradorVariables
}

export const useSaveVisitanteMoradorMutation = () => {
    const [mutate] = useMutation(saveVisitanteMorador, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const useUpdateVisianteMoradorMutation = () => {
    const [mutate] = useMutation(updateVisitanteMorador, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const usePostLLegadaVisitanteMutation = () => {
    const [mutate] = useMutation(postLlegadaVisitante, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const useUpdateLLegadaVisitanteMutations = () => {
    const [mutate] = useMutation(putLlegadoVisiante, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const useDeleteVisitanteMutation = () => {
    const [mutate] = useMutation(deleteVisitante, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const useSalidaVisitanteMution = () => {
    const [mutate] = useMutation(salidaVisitante, {
        refetchQueries: [
            { query: listadoVisitanteMorador },
            { query: listadoVisitante },
        ],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export const useListadoVisitateMoradorQuery = () => {
    return useQuery<IListadoVisitanteMoradorQuery>(listadoVisitanteMorador)
}

export const useGetVisitanteMoradorQuery = (id?: number) => {
    return useQuery<IGetVisitanteMoradorQuery>(getVisitanteMorador, {
        variables: {
            id,
        },
        skip: isNilOrEmpty(id),
    })
}

export const useListadoVisitanteQuery = () => {
    return useQuery<IListadoVisitanteQuery>(listadoVisitante)
}

export const useGetVisitanteQuery = (id?: number) => {
    return useQuery<IGetVisitanteQuery>(getVisitante, {
        variables: {
            id,
        },
        skip: isNilOrEmpty(id),
    })
}
