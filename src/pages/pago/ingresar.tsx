import React from "react";
import AppLayout from "../../components/layout/app-layout";
import PagoFormIngresar from "../../components/pago/pago-form";
import { PagoFormMulti } from "../../components/pago/pago.form-multi";

export const IngresarPago = () => {
  return (
    <AppLayout>
      <PagoFormMulti />
    </AppLayout>
  );
};

export default IngresarPago;
