import { useMutation, useQuery } from '@apollo/client'
import { IGrupoFamiliar } from '../../interface/grupo-familiar.interface'
import {
    activarVehiculos,
    eliminarVehiculo,
    getVehiculo,
    inactivarVehiculos,
    listadoVehiculo,
    listadoVehiculoFilter,
    listadoVehiculoInactivos,
    migracionVehiculo,
    saveVehiculo,
    updateVehiculo,
} from './vehiculo-typeDef'
import { isNilOrEmpty } from '../../utils/is-nil-empty'
import { IResultQueryMarca } from '../mantenimento/marca/use-marca'
import { IResultQueryColor } from '../mantenimento/color/use-color'
import { IResultQueryModelo } from '../mantenimento/modelo/use-modelo'

export interface IVehiculoVariable {
    id?: number
    grupoFamiliar: IGrupoFamiliar
    // tipo_vehiculo: string;
    placa: string
    marca: IResultQueryMarca
    color: IResultQueryColor
    // status: IResultQueryStatusVehiculo
    modelo: IResultQueryModelo

    matriculaFrontal: string
    matriculaReverso: string
    cedulaFrontal: string
    cedulaReverso: string
    num_doc_identidad: string
    ano: number
    estadoAsingnacionTag?: string
}

export interface IVehiculoVariableNormalize {
    id?: number
    nombre_familiar: string
    // tipo_vehiculo: string;
    placa: string
    marca: string
    color: string
    modelo: string
    ano: number
    // status: string
}

export const useSaveVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(saveVehiculo, {
        refetchQueries: [{ query: listadoVehiculoFilter }],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useMigracionVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(migracionVehiculo, {
        refetchQueries: [{ query: listadoVehiculoFilter }],
        awaitRefetchQueries: true,
    })

    return [mutate]
}

export const useUpdateVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateVehiculo, {
        refetchQueries: [{ query: listadoVehiculoFilter }],
        awaitRefetchQueries: true,
    })

    return [mutate, data, loading, error]
}

export const useDeleteVehiculoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(eliminarVehiculo, {
        refetchQueries: [{ query: listadoVehiculoFilter }],
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
    marca?: number
    modelo?: number
    // status?: string
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
        // skip: equals(input, {
        //     idGrupoFamiliar: 0,
        //     marca: undefined,
        //     modelo: undefined,
        //     // status: '',
        // }),
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
