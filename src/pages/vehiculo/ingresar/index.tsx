import React from "react";
import NavBar from "../../../components/layout/app-bar";
import AppLayout from "../../../components/layout/app-layout";
import FormIngresarVehiculos from "../../../components/vehiculo/vehiculo-form";

const IngresarVehiculo = () => {
  return <FormIngresarVehiculos />;
};

IngresarVehiculo.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Vehiculo - Registro ">{page}</AppLayout>;
    </>
  );
};

export default IngresarVehiculo;
