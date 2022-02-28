import {} from "react";

import AppLayout from "../../../../components/layout/app-layout";
import { IngresarManzanaForm } from "../../../../components/mantenimento/manzana/manzana-form";
import { IngresarMarcaForm } from "../../../../components/mantenimento/marca/marca-form";

const MantenimientoMarcaIngresar = () => {
  return (
    <AppLayout>
       <IngresarMarcaForm /> 
    </AppLayout>
  );
};

export default MantenimientoMarcaIngresar;
