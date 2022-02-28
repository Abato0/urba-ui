import { useMutation, useQuery } from "@apollo/client";

import { isNilOrEmpty } from "../../../utils/is-nil-empty";
import {
  postColor,
  listadoColor,
  getColor,
  updateColor,
  deleteColor,
} from "./color-typedef";

export const usePostColorMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(postColor, {
    refetchQueries: [{ query: listadoColor }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export interface IResultQueryColor {
  id: string;
  color: string;
}

export interface IListadoColor {
  ListaColor: IResultQueryColor[];
}

export const useListaColorQuery = () => {
  return useQuery<IListadoColor>(listadoColor);
};

export interface IGetColor {
  GetColor: IResultQueryColor;
}

export const useGetColorQuery = (id?: number) => {
  return useQuery<IGetColor>(getColor, {
    variables: { id },
    skip: isNilOrEmpty(id),
  });
};

export const usePutColorMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(updateColor, {
    refetchQueries: [{ query: listadoColor }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export const useDeleteColorMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(deleteColor, {
    refetchQueries: [{ query: listadoColor }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};
