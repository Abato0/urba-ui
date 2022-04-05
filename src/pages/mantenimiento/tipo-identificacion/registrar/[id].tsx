import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryParentesco,
  useGetParentescoQuery,
} from "../../../../components/mantenimento/parentesco/use-parentesco";
import { IngresarParentescoForm } from "../../../../components/mantenimento/parentesco/parentesco-form";
import {
  IResultQueryTipoIdentificacion,
  useGetTipoIdentificacionQuery,
  useListaTipoIdentificacionQuery,
  usePutTipoIdentificacionMutation,
} from "../../../../components/mantenimento/tipo-identificacion/use-tipo-identificacion";

import TipoIdentificacionFormEditar from "../../../../components/mantenimento/tipo-identificacion/tipo-identificacion-form-update";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";

const MantenimientoTipoIdentificacionEditar = () => {
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [dataTipoIdentificacion, setDataTipoIdentificacion] =
    useState<IResultQueryTipoIdentificacion>();

  const [boolPut, setBoolPut] = useState<boolean>(false);

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      router.push({ pathname: "/mantenimiento/tipo-identificacion/registrar" });
    }
    // }, 2000);
  }, [boolPut, openModalMsj, router]);

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetTipoIdentificacionQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataTipoIdentificacion(data?.GetTipoIdentificacion);
    }
  }, [loading, error, data]);

  return (
    <AppLayout titulo="Mantenimiento - Actualización de Tipo de Identificación">
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        {!loading &&
          isNotNilOrEmpty(dataTipoIdentificacion) &&
          isNotNilOrEmpty(id) && (
            <TipoIdentificacionFormEditar tipoId={dataTipoIdentificacion!} />
          )}
      </PermisoLayout>
    </AppLayout>
  );
};

export default MantenimientoTipoIdentificacionEditar;
