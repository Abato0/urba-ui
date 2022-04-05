import React from "react";
import NavBar from "../../components/layout/app-bar";
import AppLayout from "../../components/layout/app-layout";
import { PagoFormMulti } from "../../components/pago/pago.form-multi";

export const IngresarPago = () => {
  return <PagoFormMulti />;
};

IngresarPago.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <div>
      <NavBar />
      <AppLayout titulo="Pago - REGISTRO">{page}</AppLayout>;
    </div>
  );
};

export default IngresarPago;
