import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import NavBar from '../../../../components/layout/app-bar'
import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarModeloForm } from '../../../../components/mantenimento/modelo/modelo-form'
import {
    useGetModeloQuery,
    IResultQueryModelo,
} from '../../../../components/mantenimento/modelo/use-modelo'
import { isNotNilOrEmpty } from '../../../../utils/is-nil-empty'

const MantenimientoModeloEditar = () => {
    const router = useRouter()
    const [dataModelo, setDataModelo] = useState<IResultQueryModelo>()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetModeloQuery(id)

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setDataModelo(data?.GetModelo)
        }
    }, [loading, error, data])

    return (
        <LayoutTituloPagina titulo="Mantenimiento - Actualización de Modelo de Vehiculo">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                {!loading &&
                    isNotNilOrEmpty(dataModelo) &&
                    isNotNilOrEmpty(id) && (
                        <IngresarModeloForm modeloObj={dataModelo} id={id} />
                    )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoModeloEditar
