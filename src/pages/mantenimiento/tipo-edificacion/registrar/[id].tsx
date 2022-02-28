import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import { IngresarTipoEdificacionForm } from "../../../../components/mantenimento/tipo-edificacion/tipo-edificacion-form";
import {
  IResultQueryTipoEdificacion,
  useGetTipoEdificacionQuery,
} from "../../../../components/mantenimento/tipo-edificacion/use-tipo-edificacion";



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
      {!loading &&
        isNotNilOrEmpty(dataTipoEdificacion) &&
        isNotNilOrEmpty(id) && (
          <IngresarTipoEdificacionForm
            tipoEdificacionObj={dataTipoEdificacion}
            id={id}
          />
        )}
    </AppLayout>
  );
};

export default MantenimientoTipoEdificacionEditar;
