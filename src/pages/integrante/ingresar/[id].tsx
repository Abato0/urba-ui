import { useRouter } from "next/router";
import { useEffect, useMemo, useState, useCallback } from "react";
import IntegranteFormIngresar from "../../../components/integrante/integrante-form-registro";
import {
  IIntegranteVariables,
  useGetIntegranteQuery,
} from "../../../components/integrante/use-intergrante";
import AppLayout from "../../../components/layout/app-layout";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../../utils/is-nil-empty";

const IntegranteEditar = () => {
  const router = useRouter();
  const [integranteData, setIntegranteData] = useState<IIntegranteVariables>();
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      setId(Number(router.query.id));
    }
  }, [router.query.id]);
  //   const id = isNotNilOrEmpty(router.query.id) ? router.query.id : 0;

  console.log("id .", id);

  const { data, loading, error } = useGetIntegranteQuery(id);

  useEffect(() => {
    if (!loading) {
      setIntegranteData(data?.GetIntegrante);
      console.log("getIntegrante", data?.GetIntegrante);
    }
  }, [loading, error, data]);
  return (
    <AppLayout>
      {!loading && integranteData && (
        <IntegranteFormIngresar integrante={integranteData} />
      )}
    </AppLayout>
  );
};

export default IntegranteEditar;
