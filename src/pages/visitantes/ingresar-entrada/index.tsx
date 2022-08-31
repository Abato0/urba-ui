import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { VisitanteMoradorVariables } from '../../../components/visitante/form-ingresar-morador'
import FormLlegadaVisitante from '../../../components/visitante/form-llegada-visitante'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import { useGetVisitanteMoradorQuery } from '../../../components/visitante/use-visitante'
import { Box, Typography } from '@material-ui/core'

const IngresarLlegadaVisitante = () => {
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
        <LayoutTituloPagina titulo="Visitante - REGISTRO de Entrada de Visitante">
            <FormLlegadaVisitante>
                {result && (
                    <Box>
                        <Typography variant="overline">Nombre: {''}</Typography>
                    </Box>
                )}
            </FormLlegadaVisitante>
        </LayoutTituloPagina>
    )
}

export default IngresarLlegadaVisitante
