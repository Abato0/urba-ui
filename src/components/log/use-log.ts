import { useQuery } from "@apollo/client";
import { listadoLogs } from "./log-typedef";

export interface IResultQueryLog {
  id: number;
  modulo: string;
  usuario: string;
  tipoUsuario: string;
  fecha: string;
  accion: string;
  nombre_familiar: string;
}

export interface IListaLog {
  ListaLog: IResultQueryLog[];
}

export const useListadoLogQuery = () => {
  return useQuery<IListaLog>(listadoLogs);
};
