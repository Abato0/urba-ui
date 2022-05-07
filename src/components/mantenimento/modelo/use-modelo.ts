import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    postModelo,
    listadoModelo,
    getModelo,
    updateModelo,
    deleteModelo,
} from './modelo-typedef'

export const usePostModeloMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(postModelo, {
        refetchQueries: [{ query: listadoModelo }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}

export interface IResultQueryModelo {
    id: string
    modelo: string
}

export interface IListadoModelo {
    ListaModelo: IResultQueryModelo[]
}

export const useListaModeloQuery = () => {
    return useQuery<IListadoModelo>(listadoModelo, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export interface IGetModelo {
    GetModelo: IResultQueryModelo
}

export const useGetModeloQuery = (id?: number) => {
    return useQuery<IGetModelo>(getModelo, {
        variables: { id },
        skip: isNilOrEmpty(id),
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export const usePutModeloMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateModelo, {
        refetchQueries: [{ query: listadoModelo }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}

export const useDeleteModeloMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(deleteModelo, {
        refetchQueries: [{ query: listadoModelo }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}
