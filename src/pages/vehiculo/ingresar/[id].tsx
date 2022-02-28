import { useMemo, useState, useEffect } from "react";
import AppLayout from "../../../components/layout/app-layout";
import { useRouter } from "next/router";
import {
  IGetVehiculo,
  IVehiculoVariable,
  useGetVehiculoQuery,
} from "../../../components/vehiculo/use-vehiculo";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../../utils/is-nil-empty";
import { GetGrupoFamiliar } from "../../../components/grupo-familiar/grupo-familiar-typeDefs";
import FormIngresarVehiculos, { IVehiculoInputRegistro } from "../../../components/vehiculo/vehiculo-form";
import { isNil } from "ramda";

export interface IVehiculoNormalizeRegistro {
  idGrupoFamiliar: number;
  tipo_vehiculo: string;
  placa: string;
  marca: string;
  color: string;
  modelo: string;
  // matriculaPdf?: string;
}

const extractData = (
  data?: IGetVehiculo
): IVehiculoInputRegistro | undefined => {
  return data && data?.GetVehiculos
    ? {
        idGrupoFamiliar: data.GetVehiculos.grupoFamiliar.id!,
        // tipo_vehiculo: data.GetVehiculos.tipo_vehiculo,
        placa: data.GetVehiculos.placa,
        id_marca: Number(data.GetVehiculos.marca.id),
        id_color: Number(data.GetVehiculos.color.id),
        id_modelo: Number(data.GetVehiculos.modelo.id),
        id_status: Number(data.GetVehiculos.status.id),
        matriculaFrontal: undefined,
        matriculaReverso: undefined,
        cedulaFrontal: undefined,
        cedulaReverso: undefined,
        // matriculaPdf: String(data.GetVehiculos.cedulaFrontal),
      }
    : undefined;
};

const EditarVehiculo = () => {
  const router = useRouter();
  const [vehiculo, setVehiculo] = useState<IVehiculoInputRegistro>();

  const id: number = useMemo(() => {
    return Number(router.query.id);
  }, [router.query.id]);

  const { data, loading, error } = useGetVehiculoQuery(id);

  useEffect(() => {
    if (!loading && isNilOrEmpty(error) && !isNil(data)) {
      // const w = data?.GetVehiculos.matriculaPdf;
      setVehiculo(extractData(data));
    }
  }, [data, loading, error]);

  return (
    <AppLayout>
      {!loading && vehiculo && <FormIngresarVehiculos vehiculo={vehiculo} />}
    </AppLayout>
  );
};

export default EditarVehiculo;
