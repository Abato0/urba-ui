import { useMutation, useQuery } from "@apollo/client";
import { DocumentNode } from "graphql";
import {
  deleteGrupoFamiliarMutation,
  GetGrupoFamiliar,
  listadoGrupoFamiliar,
  listarGruposFamiliaresFilter,
  updateGrupoFamiliarMutation,
} from "./grupo-familiar-typeDefs";
import { equals, isEmpty } from "ramda";
import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";
import { isNilOrEmpty } from "../../utils/is-nil-empty";

export const useGrupoFamiliarMutation = (mutation: DocumentNode) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    mutation,
    // {
    //   refetchQueries: [{ query: listarGruposFamiliaresFilter }],
    //   awaitRefetchQueries: true,
    // }

    // , {
    // variables: { ...input },
    // }
  );

  return [mutate, data, loading, error];
};

export const useUpdateFamiliarMutation = (mutation: DocumentNode) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    mutation,
    // {
    //   refetchQueries: [{ query: listarGruposFamiliaresFilter }],
    //   awaitRefetchQueries: true,
    // }
    //   , {
    //   variables: { id, input },
    // }
  );

  return [mutate, data, loading, error];
};

export const useDeleteGrupoFamiliarMutatio = (id: number) => {
  const [mutate, { data = {}, loading, error }] = useMutation(
    deleteGrupoFamiliarMutation,
    // {
    //   refetchQueries: [{ query: listarGruposFamiliaresFilter }],
    //   awaitRefetchQueries: true,
    // }
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
  // color_fachada: string;
  // manzana: string;
  // villa: string;
  // calle_principal: string;
  // calle_interseccion: string;
  // tipo_edificacion: string;
}

interface IListadoGrupoFamiliar {
  ListaGruposFamiliares: IGrupoFamiliar[];
}

export const useListarGrupoFamiliar = () => {
  return useQuery<IListadoGrupoFamiliar>(listadoGrupoFamiliar, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};

export interface IGetGrupoFamiliar {
  GetGrupoFamiliar: IGrupoFamiliar;
}

export const useGetGrupoFamiliar = (id?: string) => {
  return useQuery<IGetGrupoFamiliar>(GetGrupoFamiliar, {
    variables: { id: Number(id) },
    skip: isNilOrEmpty(id),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};

export interface IListaGruposFamiliaresFilter {
  ListaGruposFamiliaresFilter: IGrupoFamiliar[];
}

export interface IGrupoFamiliarFilterInput {
  // idGrupoFamiliar?: number;
  calle_principal?: string;
  //   calle_interseccion?: string;
  manzana?: string;
}

export const useListarGrupoFamiliarFilterQuery = (
  input: IGrupoFamiliarFilterInput
) => {
  return useQuery<IListaGruposFamiliaresFilter, IGrupoFamiliarFilterInput>(
    listarGruposFamiliaresFilter,
    {
      variables: {
        ...input,
      },
      skip: isEmpty(input.calle_principal) && isEmpty(input.manzana),
    }
  );
};
