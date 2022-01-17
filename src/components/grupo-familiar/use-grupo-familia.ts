import {
  useMutation,
  useQuery,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import {
  deleteGrupoFamiliarMutation,
  listadoGrupoFamiliar,
  updateGrupoFamiliarMutation,
} from "./grupo-familiar-typeDefs";
import { useCallback } from "react";

export interface IGrupoFamiliarInput {
  nombre_familiar: string;
  celular: string;
}

export const useGrupoFamiliarMutation = (
  mutation: DocumentNode,
  input: IGrupoFamiliarInput
) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    mutation
    // , {
    // variables: { ...input },
    // }
  );

  return [mutate, data, loading, error];
};

export const useUpdateFamiliarMutation = (
  id: number,
  input: IGrupoFamiliarInput,
  mutation: DocumentNode
) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    mutation
    //   , {
    //   variables: { id, input },
    // }
  );

  return [mutate, data, loading, error];
};

export const useDeleteGrupoFamiliarMutatio = (id: number) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    deleteGrupoFamiliarMutation
    // ,
    // {
    //   variables: { id },
    // }
  );

  return [mutate, data, loading, error];
};

export interface IListadoGrupoFamiliarVariables {
  id: number;
  nombre_familiar: string;
  celular: string;
  manzana: string;
  villa: string;
  calle: string;
}

interface IListadoGrupoFamiliar {
  ListaGruposFamiliares: IListadoGrupoFamiliarVariables[];
}

export const useListarGrupoFamiliar = () => {
  return useQuery<IListadoGrupoFamiliar>(listadoGrupoFamiliar, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};
