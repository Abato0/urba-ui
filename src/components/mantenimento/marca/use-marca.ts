import { useMutation, useQuery } from "@apollo/client";

import { isNilOrEmpty } from "../../../utils/is-nil-empty";
import {
  deleteMarca,
  getMarca,
  listadoMarca,
  postMarca,
  updateMarca,
} from "./marca-typedef";

export const usePostMarcaMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(postMarca, {
    refetchQueries: [{ query: listadoMarca }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export interface IResultQueryMarca {
  id: string;
  marca: string;
}

export interface IListadoMarca {
  ListaMarca: IResultQueryMarca[];
}

export const useListaMarcaQuery = () => {
  return useQuery<IListadoMarca>(listadoMarca);
};

export interface IGetMarca {
  GetMarca: IResultQueryMarca;
}

export const useGetMarcaQuery = (id?: number) => {
  return useQuery<IGetMarca>(getMarca, {
    variables: { id },
    skip: isNilOrEmpty(id),
  });
};

export const usePutMarcaMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(updateMarca, {
    refetchQueries: [{ query: listadoMarca }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export const useDeleteMarcaMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(deleteMarca, {
    refetchQueries: [{ query: listadoMarca }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};
