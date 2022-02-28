import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { IngresarColorForm } from "../../../../components/color/color-form";
import AppLayout from "../../../../components/layout/app-layout";

import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import {
  IResultQueryCalle,
  useGetCalleQuery,
} from "../../../../components/mantenimento/calle/use-calle";

import { IngresarCalleForm } from "../../../../components/mantenimento/calle/calle-form";

const MantenimientoCalleEditar = () => {
  const router = useRouter();
  const [dataCalle, setDataCalle] = useState<IResultQueryCalle>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetCalleQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataCalle(data?.GetCalle);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading && isNotNilOrEmpty(dataCalle) && isNotNilOrEmpty(id) && (
        <IngresarCalleForm calleObj={dataCalle} id={id} />
      )}
    </AppLayout>
  );
};

export default MantenimientoCalleEditar;
