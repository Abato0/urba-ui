import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../components/layout/app-layout";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import { IngresarTipoEdificacionForm } from "../../../../components/mantenimento/tipo-edificacion/tipo-edificacion-form";
import {
  IResultQueryTipoEdificacion,
  useGetTipoEdificacionQuery,
} from "../../../../components/mantenimento/tipo-edificacion/use-tipo-edificacion";
import {
  IResultQueryValorTag,
  useGetValorTag,
} from "../../../../components/mantenimento/valor-tag/use-valor-tag";
import { IngresarValorTagForm } from "../../../../components/mantenimento/valor-tag/valor-tag-form";

const MantenimientoValorTagEditar = () => {
  const router = useRouter();
  const [dataValorTag, setDataValorTag] = useState<IResultQueryValorTag>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetValorTag(Number(id));

  //   useEffect(() => {
  //     if (!loading && isNotNilOrEmpty(data)) {
  //       setDataValorTag(data?.GetTipoEdificacion);
  //     }
  //   }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading &&
        isNotNilOrEmpty(data) &&
        isNotNilOrEmpty(data?.GetValorTag) &&
        isNotNilOrEmpty(id) && (
          <IngresarValorTagForm valorTagObj={data?.GetValorTag} id={id} />
        )}
    </AppLayout>
  );
};

export default MantenimientoValorTagEditar;
