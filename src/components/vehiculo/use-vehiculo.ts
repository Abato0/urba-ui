import { useMutation, useQuery } from '@apollo/client'
import { IGrupoFamiliar } from '../../interface/grupo-familiar.interface'
import {
    activarVehiculos,
    getVehiculo,
    inactivarVehiculos,
    listadoVehiculo,
    listadoVehiculoFilter,
    listadoVehiculoInactivos,
    saveVehiculo,
    updateVehiculo,
} from './vehiculo-typeDef'
import { isNilOrEmpty } from '../../utils/is-nil-empty'
import { IResultQueryMarca } from '../mantenimento/marca/use-marca'
import { IResultQueryColor } from '../mantenimento/color/use-color'
import { IResultQueryStatusVehiculo } from '../mantenimento/status-vehiculo/use-status-vehiculo'
import { equals } from 'ramda'
import { IResultQueryModelo } from '../mantenimento/modelo/use-modelo'

export interface IVehiculoVariable {
    id?: number
    grupoFamiliar: IGrupoFamiliar
    // tipo_vehiculo: string;
    placa: string
    marca: IResultQueryMarca
    color: IResultQueryColor
    status: IResultQueryStatusVehiculo
    modelo: IResultQueryModelo

    matriculaFrontal: string
    matriculaReverso: string
    cedulaFrontal: string
    cedulaReverso: string
    num_doc_identidad: string
}

export interface IVehiculoVariableNormalize {
    nombre_familiar: string
    // tipo_vehiculo: string;
    placa: string
    marca: string
    color: string
    modelo: string
    status: string
}

export const useSaveVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(saveVehiculo, {
        refetchQueries: [
            { query: listadoVehiculo },
            { query: listadoVehiculoFilter },
        ],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useUpdateVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateVehiculo, {
        refetchQueries: [{ query: listadoVehiculo }],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useActivadorVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(activarVehiculos, {
        refetchQueries: [{ query: listadoVehiculo }],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useInactivadorVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(inactivarVehiculos, {
        refetchQueries: [{ query: listadoVehiculo }],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export interface IListadoVehiculo {
    ListaVehiculos: IVehiculoVariable[]
}

export const useListadoVehiculosQuery = () => {
    return useQuery<IListadoVehiculo>(listadoVehiculo)
}

export interface IListarFilterVehiculoInput {
    idGrupoFamiliar?: number
    marca?: string
    modelo?: string
    status?: string
}

export interface IListarFilter {
    ListaVehiculoFilter: IVehiculoVariable[]
}

export const useListadoVehiculoFilterQuery = (
    input: IListarFilterVehiculoInput
) => {
    console.log('input: ', input)
    return useQuery<IListarFilter>(listadoVehiculoFilter, {
        variables: {
            ...input,
        },
        skip: equals(input, {
            idGrupoFamiliar: 0,
            marca: '',
            modelo: '',
            status: '',
        }),
    })
}

export interface IListadoVehiculoInactivos {
    ListaVehiculosInactivos: IVehiculoVariable[]
}

export const useListadoVehiculosInactivosQuery = () => {
    return useQuery<IListadoVehiculoInactivos>(listadoVehiculoInactivos)
}

export interface IGetVehiculo {
    GetVehiculos: IVehiculoVariable
}

export const useGetVehiculoQuery = (id?: number) => {
    return useQuery<IGetVehiculo>(getVehiculo, {
        variables: {
            id,
        },
        skip: isNilOrEmpty(id),
    })
}
