import { useMutation, useQuery } from '@apollo/client'

import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    deleteTipoEdicacion,
    getTipoEdificacion,
    listadoTipoEdificacion,
    postTipoEdificacion,
    updateTipoEdificacion,
} from './tipo-edificacion-typedef'

export interface IOutput {
    code: string
    message: string
}

export const usePostTipoEdificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        postTipoEdificacion,
        {
            refetchQueries: [{ query: listadoTipoEdificacion }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}

export interface IResultQueryTipoEdificacion {
    id: string
    tipo_edificacion: string
}

export interface IListadoTipoEdificacion {
    ListaTipoEdificacion: IResultQueryTipoEdificacion[]
}

export const useListaTipoEdificacionQuery = () => {
    return useQuery<IListadoTipoEdificacion>(listadoTipoEdificacion)
}

export interface IGetTipoEdificacion {
    GetTipoEdificacion: IResultQueryTipoEdificacion
}

export const useGetTipoEdificacionQuery = (id?: number) => {
    return useQuery<IGetTipoEdificacion>(getTipoEdificacion, {
        variables: { id },
        skip: isNilOrEmpty(id),
    })
}

export const usePutTipoEdificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        updateTipoEdificacion,
        {
            refetchQueries: [{ query: listadoTipoEdificacion }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}

export const useDeleteTipoEdificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        deleteTipoEdicacion,
        {
            refetchQueries: [{ query: listadoTipoEdificacion }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}
