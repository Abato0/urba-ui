import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import AppLayout from '../../../components/layout/app-layout'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarModeloMailForm } from '../../../components/mantenimento/modelo-mail/modelo-mail-form'
import {
    IResultQueryModeloMail,
    useGetModeloMailQuery,
} from '../../../components/mantenimento/modelo-mail/use-modelo-mail'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'

const MantenimientoModeloEditar = () => {
    const router = useRouter()
    const [dataModeloMail, setDataModeloMail] =
        useState<IResultQueryModeloMail>()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetModeloMailQuery(id)

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setDataModeloMail(data?.GetModeloMail)
        }
    }, [loading, error, data])

    return (
        <LayoutTituloPagina titulo="Parametrización - Actualización de Modelo de Correo">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                {!loading &&
                    id &&
                    isNotNilOrEmpty(dataModeloMail) &&
                    isNotNilOrEmpty(id) && (
                        <IngresarModeloMailForm
                            id={id}
                            modeloObj={dataModeloMail!}
                        />
                    )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoModeloEditar
