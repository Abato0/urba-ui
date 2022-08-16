import { useMutation, useQuery } from '@apollo/client'
import {
    asignacionUsuario,
    cambioContrasena,
    contrasenaOlvidada,
    deleteUsuario,
    envioCorreos,
    getUsuarioQuery,
    getUsuarioTokenQuery,
    listadoUsuarios,
    listadoUsuariosSinGrupoFamiliar,
    saveUsuario,
    updateUsuario,
} from './usuario-typeDefs'
import { IResultQueryTipoIdentificacion } from '../mantenimento/tipo-identificacion/use-tipo-identificacion'
import { isNil } from 'ramda'

export interface IResultUsuarioQuery {
    id: number
    user: string
    tipo_usuario: string
    num_identificacion: string
    nombres: string
    apellidos: string
    email: string
    telefono: string
    tipoIdentificacion: IResultQueryTipoIdentificacion
    grupoFamiliar?: string
}

export interface IListaUsuarioQuery {
    ListaUsuario: IResultUsuarioQuery[]
}

export interface IListaUsuarioSinGrupoFamiliarQuery {
    ListaUsuarioSinGrupoFamiliar: IResultUsuarioQuery[]
}

export interface IGetUsuarioQuery {
    GetUsuario: IResultUsuarioQuery
}

export interface IGetUsuarioTokenQuery {
    GetUsuarioToken: IResultUsuarioQuery
}

export const useListadoUsuario = () => {
    return useQuery<IListaUsuarioQuery>(listadoUsuarios)
}

export const useListadoUsuarioSinFamilares = () => {
    return useQuery<IListaUsuarioSinGrupoFamiliarQuery>(
        listadoUsuariosSinGrupoFamiliar
    )
}

export const useGetUsuario = (id?: number) => {
    return useQuery<IGetUsuarioQuery>(getUsuarioQuery, {
        variables: { id },
        skip: isNil(id),
    })
}

export const useGetUsuarioToken = () => {
    return useQuery<IGetUsuarioTokenQuery>(getUsuarioTokenQuery)
}

export const usePostUsuarioMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(saveUsuario)
    return [mutate, data, loading, error]
}

export const useDeleteUsuarioMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(deleteUsuario)
    return [mutate, data, loading, error]
}

export const useCambioContrasenaUsuarioMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(cambioContrasena)
    return [mutate, data, loading, error]
}

export const useContrasenaOlvidadaMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(contrasenaOlvidada)
    return [mutate, data, loading, error]
}

export const useUpdateUsuarioMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(updateUsuario)
    return [mutate, data, loading, error]
}

export const useEnvioCorreoMutation = () => {
    const [mutate, { data, loading, error }] = useMutation(envioCorreos)
    return [mutate, data, loading, error]
}

export const useAsignacionUsuarioMutate = () => {
    const [mutate, { data, loading, error }] = useMutation(asignacionUsuario)
    return [mutate, data, loading, error]
}
