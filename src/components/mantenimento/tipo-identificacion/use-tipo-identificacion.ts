import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import { isNil } from 'ramda'
import {
    postTipoIdentificacion,
    listadoTipoIdentificacion,
    getTipoIdentificacion,
    updateTipoIdentificacion,
    deleteTipoIdentificacion,
} from './tipo-identificacion-typedef'

export const usePostTipoIdentificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        postTipoIdentificacion,
        {
            // refetchQueries: [{ query: listadoParentesco }],
            notifyOnNetworkStatusChange: true,
        }
    )
    return [mutate, data, loading, error]
}

export interface IResultQueryTipoIdentificacion {
    id: string
    tipo_identificacion: string
}

export interface IListadoTipoIdentificacion {
    ListaTipoIdentificacion: IResultQueryTipoIdentificacion[]
}

export const useListaTipoIdentificacionQuery = () => {
    return useQuery<IListadoTipoIdentificacion>(listadoTipoIdentificacion, {
        // notifyOnNetworkStatusChange: true,
        // fetchPolicy: "cache-and-network",
    })
}

export interface IGetTipoIdentificacion {
    GetTipoIdentificacion: IResultQueryTipoIdentificacion
}

export const useGetTipoIdentificacionQuery = (id?: number) => {
    return useQuery<IGetTipoIdentificacion>(getTipoIdentificacion, {
        skip: isNil(id),
        variables: { id },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export const usePutTipoIdentificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        updateTipoIdentificacion,
        {
            // refetchQueries: [{ query: listadoParentesco }],
            notifyOnNetworkStatusChange: true,
        }
    )
    return [mutate, data, loading, error]
}

export const useDeleteTipoIdentificacionMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        deleteTipoIdentificacion,
        {
            // refetchQueries: [{ query: listadoParentesco }],
            notifyOnNetworkStatusChange: true,
        }
    )
    return [mutate, data, loading, error]
}
