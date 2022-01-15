import { FC } from "react";
import AppLayout from "../../../components/layout/app-layout";

import { saveGrupoFamiliar } from "../../../components/grupo-familiar/grupo-familiar-typeDefs";

import GrupoFamiliarFormRegistro from "../../../components/grupo-familiar/grupo-familiar-form-registro";

const RegisterGrupoFamiliar: FC = () => {
  return (
    <AppLayout>
      <GrupoFamiliarFormRegistro mutation={saveGrupoFamiliar} />
    </AppLayout>
  );
};

export default RegisterGrupoFamiliar;
