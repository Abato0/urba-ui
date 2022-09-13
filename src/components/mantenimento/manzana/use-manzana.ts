import { useMutation, useQuery } from '@apollo/client'

import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    postManzana,
    listadoMazanas,
    getManzana,
    updateManzana,
    deleteManzana,
    migracionManzanas,
} from './manzana-typeDef'

export interface IOutput {
    code: string
    message: string
}

export interface IPostManzana {
    PostCalle: IOutput
}

export interface IPostManzanaVariables {
    manzana: string
}

export const useMigracionManzanaMutation = () => {
    //   const [mutate, { data, loading, error }] =

    //   return [mutate, data, loading, error];
    const [mutate, { data, loading, error }] = useMutation(migracionManzanas, {
        refetchQueries: [{ query: listadoMazanas }],
        awaitRefetchQueries: true,
    })
    return [mutate, data, loading, error]
}

export const usePostManzanaMutation = () => {
    //   const [mutate, { data, loading, error }] =

    //   return [mutate, data, loading, error];
    const [mutate, { data, loading, error }] = useMutation(postManzana, {
        refetchQueries: [{ query: listadoMazanas }],
        awaitRefetchQueries: true,
    })
    return [mutate, data, loading, error]
}

export interface IResultQueryManzana {
    id: string
    manzana: string
}

export interface IListadoManzana {
    ListaManzana: IResultQueryManzana[]
}

export const useListaManzanaQuery = () => {
    return useQuery<IListadoManzana>(listadoMazanas)
}

export interface IGetManzana {
    GetManzana: IResultQueryManzana
}

export const useGetManzanaQuery = (id?: number) => {
    return useQuery<IGetManzana>(getManzana, {
        variables: { id },
        skip: isNilOrEmpty(id),
    })
}

export interface IPutManzanaVariables {
    id: number
    calle: string
}

export interface IPutManzana {
    PutManzana: IOutput
}

export const usePutManzanaMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateManzana, {
        refetchQueries: [{ query: listadoMazanas }],
        awaitRefetchQueries: true,
    })
    return [mutate, data, loading, error]
}

export interface IDeleteVariable {
    id: number
}
export interface IDeleteCalle {
    DeleteManzana: IOutput
}

export const useDeleteManzanaMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(deleteManzana, {
        refetchQueries: [{ query: listadoMazanas }],
        awaitRefetchQueries: true,
    })
    return [mutate, data, loading, error]
}
