import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import { IngresarTipoEdificacionForm } from "../../../../components/mantenimento/tipo-edificacion/tipo-edificacion-form";
import {
  IResultQueryTipoEdificacion,
  useGetTipoEdificacionQuery,
} from "../../../../components/mantenimento/tipo-edificacion/use-tipo-edificacion";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";

const MantenimientoTipoEdificacionEditar = () => {
  const router = useRouter();
  const [dataTipoEdificacion, setDataTipoEdificacion] =
    useState<IResultQueryTipoEdificacion>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetTipoEdificacionQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataTipoEdificacion(data?.GetTipoEdificacion);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        {!loading &&
          isNotNilOrEmpty(dataTipoEdificacion) &&
          isNotNilOrEmpty(id) && (
            <IngresarTipoEdificacionForm
              tipoEdificacionObj={dataTipoEdificacion}
              id={id}
            />
          )}
      </PermisoLayout>
    </AppLayout>
  );
};

export default MantenimientoTipoEdificacionEditar;
