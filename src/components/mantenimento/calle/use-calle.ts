import { useMutation, useQuery } from "@apollo/client";
import {
  deleteCalle,
  getCalle,
  listadoCalles,
  postCalle,
  updateCalle,
} from "./calle-typeDefs";
import { isNilOrEmpty } from "../../../utils/is-nil-empty";

export interface IOutput {
  code: number;
  message: string;
}

export interface IPostCalle {
  PostCalle: IOutput;
}

export interface IPostCalleVariables {
  calle: string;
}

export const usePostCalleMutation = () => {
  //   const [mutate, { data, loading, error }] =

  //   return [mutate, data, loading, error];
  const [mutate, { data, loading, error }] = useMutation(postCalle, {
    refetchQueries: [{ query: listadoCalles }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export interface IResultQueryCalle {
  id: string;
  calle: string;
}

export interface IListadoCalle {
  ListaCalle: IResultQueryCalle[];
}

export const useListaCallesQuery = () => {
  return useQuery<IListadoCalle>(listadoCalles);
};

export interface IGetCalle {
  GetCalle: IResultQueryCalle;
}

export const useGetCalleQuery = (id?: number) => {
  return useQuery<IGetCalle>(getCalle, {
    variables: { id },
    skip: isNilOrEmpty(id),
  });
};

export interface IPutCalleVariables {
  id: number;
  calle: string;
}

export interface IPutCalle {
  PutCalle: IOutput;
}

export const usePutCalleMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(updateCalle, {
    refetchQueries: [{ query: listadoCalles }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};

export interface IDeleteVariable {
  id: number;
}
export interface IDeleteCalle {
  DeleteCalle: IOutput;
}

export const useDeleteCalleMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(deleteCalle, {
    refetchQueries: [{ query: listadoCalles }],
    awaitRefetchQueries: true,
  });
  return [mutate, data, loading, error];
};
