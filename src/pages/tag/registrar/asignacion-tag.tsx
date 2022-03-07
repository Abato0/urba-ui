import {} from "react";
import AppLayout from "../../../components/layout/app-layout";
import { IngresarTagForm } from "../../../components/tag/tag-form-ingresar";
import { IngresarTagVehiculoForm } from "../../../components/tag/tag-vehiculo-asignacion";

const TagIngresar = () => {
  return (
    <AppLayout>
      <IngresarTagVehiculoForm />
    </AppLayout>
  );
};

export default TagIngresar;
