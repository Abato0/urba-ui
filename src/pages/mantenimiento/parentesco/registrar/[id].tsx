import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryParentesco,
  useGetParentescoQuery,
} from "../../../../components/mantenimento/parentesco/use-parentesco";
import { IngresarParentescoForm } from "../../../../components/mantenimento/parentesco/parentesco-form";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import NavBar from "../../../../components/layout/app-bar";

const MantenimientoParentescoEditar = () => {
  const router = useRouter();
  const [dataParentesco, setDataParentesco] =
    useState<IResultQueryParentesco>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetParentescoQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataParentesco(data?.GetParentesco);
    }
  }, [loading, error, data]);

  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      {!loading && isNotNilOrEmpty(dataParentesco) && isNotNilOrEmpty(id) && (
        <IngresarParentescoForm parentescoObj={dataParentesco} id={id} />
      )}
    </PermisoLayout>
  );
};

MantenimientoParentescoEditar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Actualización de Parentesco">
        {page}
      </AppLayout>
      ;
    </>
  );
};

export default MantenimientoParentescoEditar;
