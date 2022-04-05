import {} from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";
import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarColorForm } from "../../../../components/mantenimento/color/color-form";

const MantenimientoColorIngresar = () => {
  return (
    <>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        <IngresarColorForm />
      </PermisoLayout>
    </>
  );
};

MantenimientoColorIngresar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Cambio de Contraseña">{page}</AppLayout>;
    </>
  );
};


export default MantenimientoColorIngresar;
