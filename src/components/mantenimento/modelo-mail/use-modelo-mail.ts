import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    getModeloMail,
    listadoModeloMail,
    PutModeloMail,
} from './modelo-mail-typedef'

export interface IResultQueryModeloMail {
    id: number
    categoria: string
    titulo: string
    asunto: string
    textoSuperior: string
    textoInferior: string
}

export interface IListadoModeloMail {
    ListaModeloMail: IResultQueryModeloMail[]
}

export const useListaModeloMailQuery = () => {
    return useQuery<IListadoModeloMail>(listadoModeloMail, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export interface IGetModeloMail {
    GetModeloMail: IResultQueryModeloMail
}

export const useGetModeloMailQuery = (id?: number) => {
    return useQuery<IGetModeloMail>(getModeloMail, {
        variables: { id },
        skip: isNilOrEmpty(id),
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'cache-and-network',
    })
}

export const usePutModeloMailMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(PutModeloMail)
    return [mutate, data, loading, error]
}
