import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import { isNil } from 'ramda'
import {
    postParentesco,
    listadoParentesco,
    getParentesco,
    updateParentesco,
    deleteParentesco,
} from './parentesco-typedefs'

export const usePostParentescoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(postParentesco, {
        refetchQueries: [{ query: listadoParentesco }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}

export interface IResultQueryParentesco {
    id: string
    parentesco: string
}

export interface IListadoParentesco {
    ListaParentesco: IResultQueryParentesco[]
}

export const useListaParentescoQuery = () => {
    return useQuery<IListadoParentesco>(listadoParentesco, {
        // notifyOnNetworkStatusChange: true,
        // fetchPolicy: "cache-and-network",
    })
}

export interface IGetParentesco {
    GetParentesco: IResultQueryParentesco
}

export const useGetParentescoQuery = (id?: number) => {
    return useQuery<IGetParentesco>(getParentesco, {
        skip: isNil(id),
        variables: { id },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export const usePutParentescoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateParentesco, {
        refetchQueries: [{ query: listadoParentesco }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}

export const useDeleteParentescoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(deleteParentesco, {
        refetchQueries: [{ query: listadoParentesco }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}
