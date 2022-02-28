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
import { IResultQueryManzana, useGetManzanaQuery } from '../../../../components/mantenimento/manzana/use-manzana';
import { IngresarManzanaForm } from "../../../../components/mantenimento/manzana/manzana-form";
import { manzanas } from '../../../../components/core/input/dateSelect';

const MantenimientoManzanaEditar = () => {
  const router = useRouter();
  const [dataManzana, setDataManzana] = useState<IResultQueryManzana>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetManzanaQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataManzana(data?.GetManzana);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading && isNotNilOrEmpty(dataManzana) && isNotNilOrEmpty(id) && (
        <IngresarManzanaForm manzanaObj={dataManzana} id={id} />
      )}
    </AppLayout>
  );
};

export default MantenimientoManzanaEditar;
