import NavBar from "../../components/layout/app-bar";
import AppLayout from "../../components/layout/app-layout";
import { CambiarContrasenaUsuarioForm } from "../../components/usuarios/cambiar-contrasena-form";

const CambioContreasenaUsuario = () => {
  return <CambiarContrasenaUsuarioForm />;
};

CambioContreasenaUsuario.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Cambio de Contraseña">{page}</AppLayout>;
    </>
  );
};

export default CambioContreasenaUsuario;
