import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarTagForm } from '../../../components/tag/tag-form-ingresar'
import { IResultQueryTag, useGetTag } from '../../../components/tag/use-tag'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import { useListaStatusTagQuery } from '../../../components/mantenimento/status-tag/use-status-tag'

const MantenimientoMarcaEditar = () => {
    const router = useRouter()
    const [dataTag, setDataTag] = useState<IResultQueryTag>()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetTag(id)

    const { data: dataStatus, loading: loadingStatus } =
        useListaStatusTagQuery()

    const idStatus = useMemo(() => {
        if (
            !loadingStatus &&
            dataStatus &&
            dataStatus.ListaStatusTag &&
            dataTag
        ) {
            const result = dataStatus.ListaStatusTag.find(
                ({ statusTag }) => dataTag.estado === statusTag
            )
            if (result) {
                return result.id
            }
        }
    }, [loadingStatus, dataStatus, dataTag])

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setDataTag(data?.GetTag)
        }
    }, [loading, error, data])

    return (
        <LayoutTituloPagina titulo="Tags - Actualización">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                {!loading &&
                    isNotNilOrEmpty(dataTag) &&
                    isNotNilOrEmpty(idStatus) && (
                        <IngresarTagForm tag={dataTag} idStatus={idStatus} />
                    )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoMarcaEditar
