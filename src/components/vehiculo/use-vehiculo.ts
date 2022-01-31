import { useMutation } from "@apollo/client";
import { saveVehiculo } from "./vehiculo-typeDef";

interface IVehiculoVariable {
  idGrupoFamiliar: number;
  tipo_vehiculo: string;
  placa: string;
  marca: string;
  color: string;
  modelo: string;
  matriculaPdf: File;
}

export const useVehiculo = () => {
  const [mutate, { data, loading, error }] = useMutation<any,IVehiculoVariable>(saveVehiculo, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  return [mutate, data, loading, error];
};
