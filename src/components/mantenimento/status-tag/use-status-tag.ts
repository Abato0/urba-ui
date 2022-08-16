import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    postStatusTag,
    listadoStatusTag,
    getStatusTag,
    putStatusTag,
    deleteStatusTag,
} from './status-tag-typedef'

export const usePostStatusTagMutation = () => {
    const [mutate] = useMutation(postStatusTag, {
        refetchQueries: [{ query: listadoStatusTag }],
        awaitRefetchQueries: true,
    })
    return [mutate]
}

export interface IResultQueryStatusTag {
    id: number
    statusTag: string
}

export interface IListadoStatusTag {
    ListaStatusTag: IResultQueryStatusTag[]
}

export interface IGetStatusTag {
    GetStatusTag: IResultQueryStatusTag
}

export const useListaStatusTagQuery = () => {
    return useQuery<IListadoStatusTag>(listadoStatusTag)
}

export const useGetStatusTagQuery = (id?: number) => {
    return useQuery<IGetStatusTag>(getStatusTag, {
        variables: { id },
        skip: isNilOrEmpty(id),
    })
}

export const usePutStatusTagMutation = () => {
    const [mutate] = useMutation(putStatusTag, {
        refetchQueries: [{ query: listadoStatusTag }],
        awaitRefetchQueries: true,
    })

    return [mutate]
}

export const useDeleteStatusMutation = () => {
    const [mutate] = useMutation(deleteStatusTag, {
        refetchQueries: [{ query: listadoStatusTag }],
        awaitRefetchQueries: true,
    })

    return [mutate]
}
