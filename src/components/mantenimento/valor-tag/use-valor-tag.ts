import { useMutation, useQuery } from '@apollo/client'
import { isNil } from 'ramda'
import {
    deleteValorTagMutation,
    getValorTagQuery,
    listadoValorTagQuery,
    migracionValorTag,
    saveValorTagMutation,
    updateValorTagMutation,
} from './valo-tag-typedef'

export const useMigracionValorTag = () => {
    const [mutate, { data, loading, error }] = useMutation(migracionValorTag, {
        refetchQueries: [{ query: listadoValorTagQuery }],
        awaitRefetchQueries: true,
    })
    return [mutate, data, loading, error]
}

export const usePostValorTag = () => {
    const [mutate, { data, loading, error }] = useMutation(
        saveValorTagMutation,
        {
            refetchQueries: [{ query: listadoValorTagQuery }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}

export const usePutValorTag = () => {
    const [mutate, { data, loading, error }] = useMutation(
        updateValorTagMutation,
        {
            refetchQueries: [{ query: listadoValorTagQuery }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}

export const useDeleteValorTag = () => {
    const [mutate, { data, loading, error }] = useMutation(
        deleteValorTagMutation,
        {
            refetchQueries: [{ query: listadoValorTagQuery }],
            awaitRefetchQueries: true,
        }
    )
    return [mutate, data, loading, error]
}

export interface IResultQueryValorTag {
    id: number
    tipo_tag: string
    valor: number
}

export interface IListadoValorTag {
    ListaValorTag: IResultQueryValorTag[]
}

export const useListadoValorTag = () => {
    return useQuery<IListadoValorTag>(listadoValorTagQuery)
}

export interface IGetValorTag {
    GetValorTag: IResultQueryValorTag
}

export const useGetValorTag = (id?: number) => {
    return useQuery<IGetValorTag>(getValorTagQuery, {
        variables: { id: Number(id) },
        skip: isNil(id),
    })
}
