import { Button, colors, Fade, Grid, Paper } from '@material-ui/core'
import React, { useState } from 'react'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import AppLayout from '../../components/layout/app-layout'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import ListadoActivos from '../../components/vehiculo/listadoActivos'
import ListadoInactivos from '../../components/vehiculo/listadosInactivos'

const ActivacionVehiculos = () => {
    const [fadeActive, setFadeActive] = useState(0)

    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <Paper
                    style={{
                        borderRadius: 10,
                        padding: 30,
                        backgroundColor: colors.lightGreen[600],
                    }}
                >
                    <div>
                        <Grid
                            // style={{ marginTop: 40 }}
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Grid
                                item
                                style={{ display: 'flex' }}
                                xs={6}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setFadeActive(0)}
                                >
                                    Activos
                                </Button>
                            </Grid>
                            <Grid
                                style={{ display: 'flex' }}
                                alignItems="center"
                                justifyContent="center"
                                item
                                xs={6}
                            >
                                {' '}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setFadeActive(1)}
                                >
                                    Inactivos
                                </Button>
                            </Grid>
                        </Grid>
                        {/* 
                        <Fade
                            in={fadeActive === 0}
                            timeout={500}
                            appear={false}
                            exit={false}
                            unmountOnExit
                        >
                            <ListadoActivos />
                        </Fade>
                        <Fade
                            in={fadeActive === 1}
                            timeout={500}
                            appear={false}
                            exit={false}
                            unmountOnExit
                        >
                            <ListadoInactivos />
                        </Fade> */}
                    </div>
                </Paper>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default ActivacionVehiculos
