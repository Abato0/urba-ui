import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";

import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarColorForm } from "../../../../components/mantenimento/color/color-form";
import {
  IResultQueryColor,
  useGetColorQuery,
} from "../../../../components/mantenimento/color/use-color";

import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";

const MantenimientoColorEditar = () => {
  const router = useRouter();
  const [dataColor, setDataColor] = useState<IResultQueryColor>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetColorQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataColor(data?.GetColor);
    }
  }, [loading, error, data]);

  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      {!loading && isNotNilOrEmpty(dataColor) && isNotNilOrEmpty(id) && (
        <IngresarColorForm colorObj={dataColor} id={id} />
      )}
    </PermisoLayout>
  );
};

MantenimientoColorEditar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Actulización de Color">
        {page}
      </AppLayout>
      ;
    </>
  );
};

export default MantenimientoColorEditar;
