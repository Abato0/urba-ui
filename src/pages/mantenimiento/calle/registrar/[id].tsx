import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";

import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryCalle,
  useGetCalleQuery,
} from "../../../../components/mantenimento/calle/use-calle";

import { IngresarCalleForm } from "../../../../components/mantenimento/calle/calle-form";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import NavBar from "../../../../components/layout/app-bar";

const MantenimientoCalleEditar = () => {
  const router = useRouter();
  const [dataCalle, setDataCalle] = useState<IResultQueryCalle>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetCalleQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataCalle(data?.GetCalle);
    }
  }, [loading, error, data]);

  return (
    <>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        {!loading && isNotNilOrEmpty(dataCalle) && isNotNilOrEmpty(id) && (
          <IngresarCalleForm calleObj={dataCalle} id={id} />
        )}
      </PermisoLayout>
    </>
  );
};

MantenimientoCalleEditar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Actualización de Calle">
        {page}
      </AppLayout>
    </>
  );
};

export default MantenimientoCalleEditar;
