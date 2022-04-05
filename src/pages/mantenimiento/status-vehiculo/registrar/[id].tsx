import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { IngresarModeloForm } from "../../../../components/mantenimento/modelo/modelo-form";
import {
  useGetModeloQuery,
  IResultQueryModelo,
} from "../../../../components/mantenimento/modelo/use-modelo";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryStatusVehiculo,
  useGetStatusVehiculoQuery,
} from "../../../../components/mantenimento/status-vehiculo/use-status-vehiculo";
import { IngresarStatusVehiculoForm } from "../../../../components/mantenimento/status-vehiculo/status-vehiculo-form";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import NavBar from "../../../../components/layout/app-bar";

const MantenimientoStatusVehiculoEditar = () => {
  const router = useRouter();
  const [dataStatusVehiculo, setDataStatusVehiculo] =
    useState<IResultQueryStatusVehiculo>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetStatusVehiculoQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataStatusVehiculo(data?.GetStatusVehiculo);
    }
  }, [loading, error, data]);

  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      {!loading &&
        isNotNilOrEmpty(dataStatusVehiculo) &&
        isNotNilOrEmpty(id) && (
          <IngresarStatusVehiculoForm
            statusVehiculoObj={dataStatusVehiculo}
            id={id}
          />
        )}
    </PermisoLayout>
  );
};

MantenimientoStatusVehiculoEditar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Actualización de Status del Vehiculo">
        {page}
      </AppLayout>
      ;
    </>
  );
};

export default MantenimientoStatusVehiculoEditar;
