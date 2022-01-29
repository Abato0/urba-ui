import { useMutation, useQuery } from "@apollo/client";
import { DocumentNode } from "graphql";
import {
  deleteGrupoFamiliarMutation,
  listadoGrupoFamiliar,
  listarGruposFamiliares,
  updateGrupoFamiliarMutation,
} from "./grupo-familiar-typeDefs";
import { useCallback } from "react";
import { IIntegranteFilterInput } from "../integrante/use-intergrante";
import { equals } from "ramda";
import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";

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
  color_fachada: string;
  manzana: string;
  villa: string;
  calle_principal: string;
  calle_interseccion: string;
  tipo_edificacion: string;
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


export interface IListaGruposFamiliaresFilter {
  ListaGruposFamiliaresFilter: IGrupoFamiliar[];
}

export const useListarGrupoFamiliarFilterQuery = (
  input: IIntegranteFilterInput
) => {
  return useQuery<IListaGruposFamiliaresFilter, IIntegranteFilterInput>(
    listarGruposFamiliares,
    {
      variables: {
        ...input,
      },
      skip: equals(input, {
        calle_interseccion: "",
        idGrupoFamiliar: 0,
        calle_principal: "",
        manzana: "",
      }),
    }
  );
};
