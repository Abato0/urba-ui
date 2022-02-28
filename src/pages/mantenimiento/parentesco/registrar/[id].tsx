import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { IngresarModeloForm } from "../../../../components/mantenimento/modelo/modelo-form";
import {
  useGetModeloQuery,
  IResultQueryModelo,
} from "../../../../components/mantenimento/modelo/use-modelo";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryParentesco,
  useGetParentescoQuery,
} from "../../../../components/mantenimento/parentesco/use-parentesco";
import { IngresarParentescoForm } from "../../../../components/mantenimento/parentesco/parentesco-form";

const MantenimientoParentescoEditar = () => {
  const router = useRouter();
  const [dataParentesco, setDataParentesco] =
    useState<IResultQueryParentesco>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetParentescoQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataParentesco(data?.GetParentesco);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading && isNotNilOrEmpty(dataParentesco) && isNotNilOrEmpty(id) && (
        <IngresarParentescoForm parentescoObj={dataParentesco} id={id} />
      )}
    </AppLayout>
  );
};

export default MantenimientoParentescoEditar;
