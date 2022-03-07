import { IResultQueryValorTag } from "../mantenimento/valor-tag/use-valor-tag";
import { IVehiculoVariable } from "../vehiculo/use-vehiculo";
import { useMutation, useQuery } from "@apollo/client";
import {
  getTag,
  listadoAllTags,
  listadoTagPagos,
  listadoTags,
  listaTagVehiculo,
  postTag,
  postTagVehiculo,
  putTag,
} from "./tag-typedef";
import { isNil } from "ramda";

export interface IResultQueryTagPagos {
  id: number;
  valorTag: IResultQueryValorTag;
  fecha_pago: string;
  monto: number;
  vehiculo: IVehiculoVariable;
}
export interface IResultQueryTag {
  id: number;
  code: string;
  estado: string;
}
export interface IResultQueryTagVehiculo {
  id: number;
  tag: IResultQueryTag;
  vehiculo: IVehiculoVariable;
}

export interface IListaTagVehiculo {
  ListaTagVehiculo: IResultQueryTagVehiculo[];
}

export interface IListaTag {
  ListaTag: IResultQueryTag[];
}

export interface IListaAllTag {
  ListaTagAll: IResultQueryTag[];
}


export interface IGetListaTag {
  GetTag: IResultQueryTag;
}

export interface IListaTagPago {
  ListaTagPago: IResultQueryTagPagos[];
}

export const useListaTagPagos = () => {
  return useQuery<IListaTagPago>(listadoTagPagos);
};

export const useListaTag = () => {
  return useQuery<IListaTag>(listadoTags);
};

export const useListaAllTag = () => {
  return useQuery<IListaAllTag>(listadoAllTags);
};

export const useListaTagVehiculo = () => {
  return useQuery<IListaTagVehiculo>(listaTagVehiculo);
};

export const useGetTag = (id?: number) => {
  return useQuery<IGetListaTag>(getTag, {
    skip: isNil(id),
    variables: { id },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
};

export const usePostTagMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(postTag);
  return [mutate, data, loading, error];
};

export const usePostTagVehiculoMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(postTagVehiculo);
  return [mutate, data, loading, error];
};

export const usePutTagMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(putTag);
  return [mutate, data, loading, error];
};

export const useDeleteTagMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(putTag);
  return [mutate, data, loading, error];
};
