import { useMutation, useQuery } from '@apollo/client'
import { isNilOrEmpty } from '../../../utils/is-nil-empty'
import {
    postStatusVehiculo,
    listadoStatusVehiculo,
    getStatusVehiculo,
    updateStatusVehiculo,
    deleteStatusVehiculo,
} from './status-vehiculo-typedef'

export const usePostStatusVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(postStatusVehiculo, {
        refetchQueries: [{ query: listadoStatusVehiculo }],
        notifyOnNetworkStatusChange: true,
    })
    return [mutate, data, loading, error]
}

export interface IResultQueryStatusVehiculo {
    id: string
    statusVehiculo: string
}

export interface IListadoStatusVehiculo {
    ListaStatusVehiculo: IResultQueryStatusVehiculo[]
}

export const useListaStatusVehiculoQuery = () => {
    return useQuery<IListadoStatusVehiculo>(listadoStatusVehiculo)
}

export interface IGetStatusVehiculo {
    GetStatusVehiculo: IResultQueryStatusVehiculo
}

export const useGetStatusVehiculoQuery = (id?: number) => {
    return useQuery<IGetStatusVehiculo>(getStatusVehiculo, {
        variables: { id },
        skip: isNilOrEmpty(id),
    })
}

export const usePutStatusVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        updateStatusVehiculo,
        {
            refetchQueries: [{ query: listadoStatusVehiculo }],
            notifyOnNetworkStatusChange: true,
        }
    )
    return [mutate, data, loading, error]
}

export const useDeleteStatusVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(
        deleteStatusVehiculo,
        {
            refetchQueries: [{ query: listadoStatusVehiculo }],
            notifyOnNetworkStatusChange: true,
        }
    )
    return [mutate, data, loading, error]
}
