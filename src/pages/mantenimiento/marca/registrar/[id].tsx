import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";

import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarManzanaForm } from "../../../../components/mantenimento/manzana/manzana-form";
import { IngresarMarcaForm } from "../../../../components/mantenimento/marca/marca-form";
import {
  IResultQueryMarca,
  useGetMarcaQuery,
} from "../../../../components/mantenimento/marca/use-marca";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";

const MantenimientoMarcaEditar = () => {
  const router = useRouter();
  const [dataMarca, setDataMarca] = useState<IResultQueryMarca>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetMarcaQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataMarca(data?.GetMarca);
    }
  }, [loading, error, data]);

  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      {!loading && isNotNilOrEmpty(dataMarca) && isNotNilOrEmpty(id) && (
        <IngresarMarcaForm marcaObj={dataMarca} id={id} />
      )}
    </PermisoLayout>
  );
};

MantenimientoMarcaEditar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Actualización de Marcas Vehiculares">
        {page}
      </AppLayout>
      ;
    </>
  );
};

export default MantenimientoMarcaEditar;
