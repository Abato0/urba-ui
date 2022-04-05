import {} from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";

import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarModeloForm } from "../../../../components/mantenimento/modelo/modelo-form";

const MantenimientoModeloIngresar = () => {
  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      <IngresarModeloForm />
    </PermisoLayout>
  );
};

MantenimientoModeloIngresar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Cambio de Contraseña">{page}</AppLayout>;
    </>
  );
};

export default MantenimientoModeloIngresar;
