import {} from "react";
import IntegranteFormIngresar from "../../../components/integrante/integrante-form-registro";
import NavBar from "../../../components/layout/app-bar";
import AppLayout from "../../../components/layout/app-layout";

const IntegranteIngresar = () => {
  return <IntegranteFormIngresar />;
};

IntegranteIngresar.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <div>
      <NavBar />
      <AppLayout titulo=" Integrante Familiar - Registro">{page}</AppLayout>;
    </div>
  );
};

export default IntegranteIngresar;
