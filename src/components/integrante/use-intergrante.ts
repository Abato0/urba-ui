import { useMutation, useQuery } from "@apollo/client";
import { IListadoGrupoFamiliarVariables } from "../grupo-familiar/use-grupo-familia";
import { isNilOrEmpty } from "../../utils/is-nil-empty";
import {
  saveIntegrante,
  listadoIntegrante,
  getIntegrante,
  updateIntegrante,
  listaIntergranteFilter,
} from "./integrante-typedefs";
import { equals } from "ramda";

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
  tipo_doc_identidad: string;
  num_doc_identidad: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  genero: string;
  fecha_nacimiento: string;
  piso_ocupa: string;
  status: string;
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

export interface IIntegranteFilterInput {
  idGrupoFamiliar?: number;
  calle_principal?: string;
  calle_interseccion?: string;
  manzana?: string;
}

export const useGetIntegranteQuery = (id: number) => {
  return useQuery<IGetIntegranteQuery>(getIntegrante, {
    variables: { id },
    skip: id === 0 || isNilOrEmpty(id),
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};

export interface IListaIntegranteFilterQuery {
  ListaIntegranteFilter: IIntegranteVariables[];
}

export const useListaIntergranteFilterQuery = (
  input: IIntegranteFilterInput
) => {
  return useQuery<IListaIntegranteFilterQuery, IIntegranteFilterInput>(
    listaIntergranteFilter,
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
