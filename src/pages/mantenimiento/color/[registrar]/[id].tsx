import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import AppLayout from "../../../../components/layout/app-layout";
import { IngresarColorForm } from "../../../../components/mantenimento/color/color-form";
import { IResultQueryColor, useGetColorQuery } from "../../../../components/mantenimento/color/use-color";

import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";


const MantenimientoColorEditar = () => {
  const router = useRouter();
  const [dataColor, setDataColor] = useState<IResultQueryColor>();

  const id = useMemo(() => {
    if (isNotNilOrEmpty(router.query.id)) {
      return Number(router.query.id);
    }
  }, [router.query.id]);

  const { data, loading, error } = useGetColorQuery(id);

  useEffect(() => {
    if (!loading && isNotNilOrEmpty(data)) {
      setDataColor(data?.GetColor);
    }
  }, [loading, error, data]);

  return (
    <AppLayout>
      {!loading && isNotNilOrEmpty(dataColor) && isNotNilOrEmpty(id) && (
        <IngresarColorForm colorObj={dataColor} id={id} />
      )}
    </AppLayout>
  );
};

export default MantenimientoColorEditar;
