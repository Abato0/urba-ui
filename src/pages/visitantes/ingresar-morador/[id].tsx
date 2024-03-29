import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import {
    FormIngresarMorador,
    VisitanteMoradorVariables,
} from '../../../components/visitante/form-ingresar-morador'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import { useGetVisitanteMoradorQuery } from '../../../components/visitante/use-visitante'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'

const UpdateVisitanteMorador = () => {
    const router = useRouter()

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading } = useGetVisitanteMoradorQuery(id)

    const result: VisitanteMoradorVariables | null = useMemo(() => {
        if (!loading && data && data.GetVisitante) {
            return {
                idGrupoFamiliar: data.GetVisitante.grupoFamiliar.id!,
                nombre_visitante: data.GetVisitante.nombre_visitante,
                descripcion: data.GetVisitante.descripcion,
                fecha_visita: data.GetVisitante.fecha_visita,
            }
        }
        return null
    }, [data, loading])

    return (
        <LayoutTituloPagina titulo="Visitante - Actualizar">
            <PermisoLayout
                tipoUsuarioRecibido={[
                    TipoUsuario.ADMIN,
                    TipoUsuario.OPERATIVO,
                    TipoUsuario.MORADOR,
                ]}
            >
                {result && id && (
                    <FormIngresarMorador id={id} morador={result} />
                )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default UpdateVisitanteMorador
