import { FC } from "react";
import AppLayout from "../../../components/layout/app-layout";

import { saveGrupoFamiliar } from "../../../components/grupo-familiar/grupo-familiar-typeDefs";

import GrupoFamiliarFormRegistro from "../../../components/grupo-familiar/grupo-familiar-form-registro";
import NavBar from "../../../components/layout/app-bar";

const RegisterGrupoFamiliar = () => {
  return <GrupoFamiliarFormRegistro mutation={saveGrupoFamiliar} />;
};

RegisterGrupoFamiliar.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <div>
      <NavBar />
      <AppLayout titulo="Grupo Familiar - Registro">{page}</AppLayout>;
    </div>
  );
};

export default RegisterGrupoFamiliar;
