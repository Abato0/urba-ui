import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarTagForm } from '../../../components/tag/tag-form-ingresar'
import { IResultQueryTag, useGetTag } from '../../../components/tag/use-tag'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'

const MantenimientoMarcaEditar = () => {
    const router = useRouter()
    const [dataTag, setDataTag] = useState<IResultQueryTag>()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetTag(id)

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
                    isNotNilOrEmpty(id) && (
                        <IngresarTagForm tag={dataTag} id={id} />
                    )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoMarcaEditar
