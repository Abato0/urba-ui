import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import NavBar from "../../../../components/layout/app-bar";
import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarParentescoForm } from "../../../../components/mantenimento/parentesco/parentesco-form";

const MantenimientoParentescoIngresar = () => {
  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      <IngresarParentescoForm />
    </PermisoLayout>
  );
};

MantenimientoParentescoIngresar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout>{page}</AppLayout>;
    </>
  );
};

export default MantenimientoParentescoIngresar;
