import { useRouter } from "next/router"
import { useMemo, useState, useEffect } from 'react';
import { TipoUsuario } from "../../../../components/core/input/dateSelect";
import PermisoLayout from "../../../../components/layout/auth-layout/permiso-layout";
import LayoutTituloPagina from "../../../../components/layout/tituloPagina-layout";
import { IngresarColorForm } from "../../../../components/mantenimento/color/color-form";
import { isNotNilOrEmpty } from "../../../../utils/is-nil-empty";
import { IResultQueryStatusTag, useGetStatusTagQuery } from '../../../../components/mantenimento/status-tag/use-status-tag';
import { IngresarStatusTagForm } from '../../../../components/mantenimento/status-tag/status-tag-form';


const MantenimientoStatusTagEditar = () => {
    const router = useRouter();
    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const [dataStatus, setDataStatus] = useState<IResultQueryStatusTag>()

    const { data, loading } = useGetStatusTagQuery(id);
    useEffect(() => {
        if (!loading && data && isNotNilOrEmpty(data.GetStatusTag)) {
            setDataStatus(data.GetStatusTag)
        }
    }, [loading, data])


    return <LayoutTituloPagina titulo="Parametrización - Actulización de Status de Tag">
        <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}>
            {!loading &&
                isNotNilOrEmpty(dataStatus) &&
                isNotNilOrEmpty(id) && (
                    <IngresarStatusTagForm statusObj={dataStatus} />
                )}
        </PermisoLayout>
    </LayoutTituloPagina>
}

export default MantenimientoStatusTagEditar