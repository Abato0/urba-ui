import { useMutation, useQuery } from "@apollo/client";
import { IListadoGrupoFamiliarVariables } from "../grupo-familiar/use-grupo-familia";
import { isNilOrEmpty } from "../../utils/is-nil-empty";
import {
  saveIntegrante,
  listadoIntegrante,
  getIntegrante,
  updateIntegrante,
} from "./integrante-typedefs";

export const usePostIntegranteMutation = () => {
  const [mutate, { data, loading, error }] = useMutation<any, any>(
    saveIntegrante
  );

  return [mutate, data, loading, error];
};

export const useUpdateIntegranteMutation = () => {
  const [mutate, { data, loading, error }] = useMutation<any, any>(
    updateIntegrante
  );

  return [mutate, data, loading, error];
};

export interface IIntegranteVariables {
  id: number;
  apellido: string;
  cedula: string;
  fecha_nacimiento: string;
  nombre: string;
  parentesco: string;
  telefono: string;
  grupoFamiliar: IListadoGrupoFamiliarVariables;
}

export interface IListaListadoIntegranteQuery {
  ListaIntegrantes: IIntegranteVariables[];
}

export const useListadoIntegranteQuery = () => {
  return useQuery<IListaListadoIntegranteQuery>(listadoIntegrante, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};

export interface IGetIntegranteQuery {
  GetIntegrante: IIntegranteVariables;
}

export const useGetIntegranteQuery = (id: number) => {
  return useQuery<IGetIntegranteQuery>(getIntegrante, {
    variables: { id },
    skip: id === 0 || isNilOrEmpty(id),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};
