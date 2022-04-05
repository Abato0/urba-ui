import {} from "react";
import { TipoUsuario } from "../../../components/core/input/dateSelect";
import NavBar from "../../../components/layout/app-bar";
import AppLayout from "../../../components/layout/app-layout";
import PermisoLayout from "../../../components/layout/auth-layout/permiso-layout";
import { IngresarTagForm } from "../../../components/tag/tag-form-ingresar";

const TagIngresar = () => {
  return (
    <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
      <IngresarTagForm />
    </PermisoLayout>
  );
};

TagIngresar.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Tags - Registro">{page}</AppLayout>;
    </>
  );
};

export default TagIngresar;
