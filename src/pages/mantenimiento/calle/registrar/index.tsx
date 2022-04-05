import {} from "react";
import { IngresarCalleForm } from "../../../../components/mantenimento/calle/calle-form";

import AppLayout from "../../../../components/layout/app-layout";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import NavBar from "../../../../components/layout/app-bar";

const MantenimientoCalleIngresar = () => {
  return (
    <>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        <IngresarCalleForm />
      </PermisoLayout>
    </>
  );
};

MantenimientoCalleIngresar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout>{page}</AppLayout>;
    </>
  );
};

export default MantenimientoCalleIngresar;
