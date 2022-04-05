import {} from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";

import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarManzanaForm } from "../../../../components/mantenimento/manzana/manzana-form";

const MantenimientoManzanaIngresar = () => {
  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      <IngresarManzanaForm />
    </PermisoLayout>
  );
};

MantenimientoManzanaIngresar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout>{page}</AppLayout>;
    </>
  );
};

export default MantenimientoManzanaIngresar;
