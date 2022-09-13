import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import FormLlegadaVisitante, {
    IVisitaneMoradorLlegadaVariables,
} from '../../../components/visitante/form-llegada-visitante'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import { useGetVisitanteQuery } from '../../../components/visitante/use-visitante'
import { Typography } from '@material-ui/core'
import { Grid } from '@mui/material'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'

const IngresarLlegadaVisitante = () => {
    const router = useRouter()
    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading } = useGetVisitanteQuery(id)

    const result = useMemo(() => {
        if (!loading && data && data.GetVisitante) {
            return data.GetVisitante
        }
        return null
    }, [data, loading])

    const moradorEditar: IVisitaneMoradorLlegadaVariables | undefined =
        useMemo(() => {
            if (result && isNotNilOrEmpty(result.identificacion_visitante)) {
                return {
                    identificacion_visitante: result.identificacion_visitante,
                    placa_vehiculo: result.placa_vehiculo,
                }
            }
            // return null
        }, [result])

    return (
        <LayoutTituloPagina titulo="Visitante - REGISTRO de Entrada de Visitante">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.SEGURIDAD]}
            >
                {id && (
                    <FormLlegadaVisitante
                        id={id}
                        moradorLlegada={moradorEditar}
                    >
                        {result && (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant="overline">
                                        <span style={{ fontWeight: 'bold' }}>
                                            Nombre:
                                        </span>
                                        <span style={{ marginLeft: '5%' }}>
                                            {result.nombre_visitante}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="overline">
                                        <span style={{ fontWeight: 'bold' }}>
                                            Invitado por:
                                        </span>
                                        <span style={{ marginLeft: '5%' }}>
                                            {
                                                result.grupoFamiliar
                                                    .nombre_familiar
                                            }
                                        </span>
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </FormLlegadaVisitante>
                )}
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default IngresarLlegadaVisitante
