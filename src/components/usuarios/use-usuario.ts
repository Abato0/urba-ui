import { useMutation, useQuery } from "@apollo/client";
import {
  cambioContrasena,
  contrasenaOlvidada,
  deleteUsuario,
  getUsuarioQuery,
  getUsuarioTokenQuery,
  listadoUsuarios,
  saveUsuario,
  updateUsuario,
} from "./usuario-typeDefs";
import { IResultQueryTipoIdentificacion } from "../mantenimento/tipo-identificacion/use-tipo-identificacion";

export interface IResultUsuarioQuery {
  id: number;
  user: string;
  tipo_usuario: string;
  num_identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipoIdentificacion: IResultQueryTipoIdentificacion;
}

export interface IListaUsuarioQuery {
  ListaUsuario: IResultUsuarioQuery[];
}

export interface IGetUsuarioQuery {
  GetUsuario: IResultUsuarioQuery;
}

export interface IGetUsuarioTokenQuery {
  GetUsuarioToken: IResultUsuarioQuery;
}

export const useListadoUsuario = () => {
  return useQuery<IListaUsuarioQuery>(listadoUsuarios);
};

export const useGetUsuario = () => {
  return useQuery<IGetUsuarioQuery>(getUsuarioQuery);
};

export const useGetUsuarioToken = () => {
  return useQuery<IGetUsuarioTokenQuery>(getUsuarioTokenQuery);
};

export const usePostUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(saveUsuario);
  return [mutate, data, loading, error];
};

export const useDeleteUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(deleteUsuario);
  return [mutate, data, loading, error];
};

export const useCambioContrasenaUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(cambioContrasena);
  return [mutate, data, loading, error];
};

export const useContrasenaOlvidadaMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(contrasenaOlvidada);
  return [mutate, data, loading, error];
};

export const useUpdateUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(updateUsuario);
  return [mutate, data, loading, error];
};
