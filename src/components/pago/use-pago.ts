import { useMutation, useQuery } from "@apollo/client";
import {
  getPagoFamiliar,
  getPagoFamiliarFilter,
  listadoPago,
  savePago,
  subirFoto,
} from "./pago-typedefs";
import { isNil, isEmpty, equals } from "ramda";
import { AllPago } from "../../interface/pago.interface";

export const usePostPago = () => {
  const [mutate, { data, loading, error }] = useMutation(savePago, {
    refetchQueries: [{ query: listadoPago }, { query: getPagoFamiliarFilter }],
    awaitRefetchQueries: true,
  });

  return [mutate, data, loading, error];
};

export const useSubirFoto = () => {
  const [mutate, { data, loading, error }] = useMutation(subirFoto);
  return [mutate, data, loading, error];
};

interface ListaPagos {
  ListaPagos: AllPago[];
}

export const useAllListadoPago = () => {
  return useQuery<ListaPagos>(listadoPago);
};

interface ListaPagos {
  GetPagoFamiliar: AllPago;
}

export const usePagoFamiliar = (id: number) => {
  return useQuery<ListaPagos>(getPagoFamiliar, {
    skip: id === 0,
    variables: {
      id,
    },
  });
};

export interface IPagoGrupoFamiliarInput {
  idGrupoFamiliar?: number;
  // id_aporte?: number;
  mes?: string;
  anio?: number;
}

interface IPagoGrupoFamiliarFiltersFunc {
  ListaPagoFamiliarFilter: IDataListaPagoFilter[];
}

export interface IDataListaPagoFilter {
  id: number;
  grupoFamiliar: {
    nombre_familiar: string;
  };
  pago: {
    tipo_pago: string;
    fecha_pago: string;
    fecha_subida: string;
    descripcion: string;
    monto: number;
  };
  // aporte: {
  //   nombre_aporte: string;
  //   tipo_aporte: string;
  // };
}

export const usePagoFamiliarFilters = (input: IPagoGrupoFamiliarInput) => {
  //console.log("Input: ", input);
  return useQuery<IPagoGrupoFamiliarFiltersFunc, IPagoGrupoFamiliarInput>(
    getPagoFamiliarFilter,
    {
      variables: {
        ...input,
      },
      skip: equals(input, {
        mes: "",
        idGrupoFamiliar: 0,
        anio: 0,
        // id_aporte: 0,
      }),
      // skip: isEmpty(input),
    }
  );
};
