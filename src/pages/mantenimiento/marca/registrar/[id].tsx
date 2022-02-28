import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import AppLayout from "../../../../components/layout/app-layout";
import { IngresarManzanaForm } from "../../../../components/mantenimento/manzana/manzana-form";
import { IngresarMarcaForm } from "../../../../components/mantenimento/marca/marca-form";
import {
  IResultQueryMarca,
  useGetMarcaQuery,
} from "../../../../components/mantenimento/marca/use-marca";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";

const MantenimientoMarcaEditar = () => {
  const router = useRouter();
  const [dataMarca, setDataMarca] = useState<IResultQueryMarca>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetMarcaQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataMarca(data?.GetMarca);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading && isNotNilOrEmpty(dataMarca) && isNotNilOrEmpty(id) && (
        <IngresarMarcaForm marcaObj={dataMarca} id={id} />
      )}
    </AppLayout>
  );
};

export default MantenimientoMarcaEditar;
