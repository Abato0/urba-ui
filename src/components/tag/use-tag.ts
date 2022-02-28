import { IResultQueryValorTag } from "../mantenimento/valor-tag/use-valor-tag";
import { IVehiculoVariable } from "../vehiculo/use-vehiculo";
import { useQuery } from "@apollo/client";
import { listadoTags } from "./tag-typedef";

export interface IResultQueryTags {
  id: number;
  tag: {
    valorTag: IResultQueryValorTag;
    fecha_pago: string;
    monto: number;
  };
  vehiculo: IVehiculoVariable;
}

export interface IListaTags {
  ListaTags: IResultQueryTags[];
}

export const useListaTags = () => {
  return useQuery<IListaTags>(listadoTags);
};
