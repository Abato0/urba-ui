import {} from "react";
import NavBar from "../../../../components/layout/app-bar";
import AppLayout from "../../../../components/layout/app-layout";
import { IngresarValorTagForm } from "../../../../components/mantenimento/valor-tag/valor-tag-form";

const MantenimientoValorTagRegistrar = () => {
  return <IngresarValorTagForm />;
};

MantenimientoValorTagRegistrar.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout>{page}</AppLayout>;
    </>
  );
};

export default MantenimientoValorTagRegistrar;
