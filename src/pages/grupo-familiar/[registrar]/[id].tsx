import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { isNil, isEmpty, prop } from "ramda";
import { useMemo, useEffect, useState } from "react";
import GrupoFamiliarFormRegistro from "../../../components/grupo-familiar/grupo-familiar-form-registro";
import {
  saveGrupoFamiliar,
  GetGrupoFamiliar,
  updateGrupoFamiliarMutation,
} from "../../../components/grupo-familiar/grupo-familiar-typeDefs";
import AppLayout from "../../../components/layout/app-layout";
import { codeBase64 } from "../../../utils/file-base64";

const UpdateGrupoFamiliar = () => {
  const router = useRouter();
  const [grupoFamiliarData, setGrupoFamiliarData] = useState<any>();
  // console.log("router: ", router.query);
  const id = useMemo(() => {
    return router.query.id;
  }, [router.query.id]);

  const { data, loading, error } = useQuery(GetGrupoFamiliar, {
    variables: { id: Number(id) },
  });

  useEffect(() => {
    if (!loading) {
      setGrupoFamiliarData(extractData(data));
    }
  }, [loading]);

  return !isNil(grupoFamiliarData) ? (
    <AppLayout>
      <GrupoFamiliarFormRegistro
        mutation={updateGrupoFamiliarMutation}
        grupoFam={{
          ...grupoFamiliarData,
          // id: grupoFamiliarData.id,
          // celular: grupoFamiliarData.celular,
          // nombre_familiar: grupoFamiliarData.nombre_familiar,
          // calle:
        }}
      />
    </AppLayout>
  ) : (
    <></>
  );
};

const extractData = (data: any = {}) => {
  return !isNil(data) && !isEmpty(data) ? data.GetGrupoFamiliar : (data = []);
};

export default UpdateGrupoFamiliar;
