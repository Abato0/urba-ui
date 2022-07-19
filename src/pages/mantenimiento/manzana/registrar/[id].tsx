import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { isNotNilOrEmpty } from '../../../../utils/is-nil-empty'
import {
    IResultQueryManzana,
    useGetManzanaQuery,
} from '../../../../components/mantenimento/manzana/use-manzana'
import { IngresarManzanaForm } from '../../../../components/mantenimento/manzana/manzana-form'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'

const MantenimientoManzanaEditar = () => {
    const router = useRouter()
    const [dataManzana, setDataManzana] = useState<IResultQueryManzana>()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetManzanaQuery(id)

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setDataManzana(data?.GetManzana)
        }
    }, [loading, error, data])

    return (
        <LayoutTituloPagina titulo="Parametrización - Actualización de Manzana">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                {!loading &&
                    isNotNilOrEmpty(dataManzana) &&
                    isNotNilOrEmpty(id) && (
                        <IngresarManzanaForm manzanaObj={dataManzana} id={id} />
                    )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoManzanaEditar
