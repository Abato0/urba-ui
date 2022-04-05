import {} from "react";
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import AppLayout from "../../../../components/layout/app-layout";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import { IngresarTipoEdificacionForm } from "../../../../components/mantenimento/tipo-edificacion/tipo-edificacion-form";

const MantenimientoTipoEdificacionRegistrar = () => {
  return (
    <AppLayout>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
        <IngresarTipoEdificacionForm />
      </PermisoLayout>
    </AppLayout>
  );
};

export default MantenimientoTipoEdificacionRegistrar;
