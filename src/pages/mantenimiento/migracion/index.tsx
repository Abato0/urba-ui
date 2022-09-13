import { Box, Button, createStyles, Grid, makeStyles } from '@material-ui/core'
import { useState } from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { FormIngresarExcelGeneral } from '../../../components/migracion/form-ingresar-general-excel'
import { FormIngresarExcelAportacion } from '../../../components/migracion/form-ingresar-aportacion-excel'
import { FormIngresarExcelParametrizacion } from '../../../components/migracion/form-ingresar-parametrizacion-excel'
import { COLOR_PRIMARIO, COLOR_SECUDARIO } from '../../../utils/keys'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(20),
            marginRight: theme.spacing(20),
            padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            minWidth: '100px',
        },
        button: {
            backgroundColor: COLOR_PRIMARIO,
            color: 'white',
            width: theme.spacing(20),
            height: theme.spacing(5),
            '&:hover': {
                backgroundColor: COLOR_SECUDARIO,
                color: 'white',
            },
        },
    })
)

const MantenimientoMigracion = () => {
    const classes = useStyles()

    const [buttonSelccionado, setButtonSeleccionado] = useState(1)
    return (
        <LayoutTituloPagina titulo="Parametrización - Migración">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <Box className={classes.root}>
                    <Grid
                        container
                        spacing={4}
                        style={{ justifyContent: 'center', marginBottom: '6%' }}
                    >
                        <Grid item>
                            <Button
                                className={classes.button}
                                style={{
                                    backgroundColor:
                                        buttonSelccionado === 1
                                            ? COLOR_SECUDARIO
                                            : COLOR_PRIMARIO,
                                }}
                                variant="outlined"
                                onClick={() => setButtonSeleccionado(1)}
                            >
                                General
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className={classes.button}
                                style={{
                                    backgroundColor:
                                        buttonSelccionado === 2
                                            ? COLOR_SECUDARIO
                                            : COLOR_PRIMARIO,
                                }}
                                variant="outlined"
                                onClick={() => setButtonSeleccionado(2)}
                            >
                                Aportaciones
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className={classes.button}
                                style={{
                                    backgroundColor:
                                        buttonSelccionado === 3
                                            ? COLOR_SECUDARIO
                                            : COLOR_PRIMARIO,
                                }}
                                variant="outlined"
                                onClick={() => setButtonSeleccionado(3)}
                            >
                                Parametrización
                            </Button>
                        </Grid>
                    </Grid>
                    <div
                    // style={{
                    //     display: 'flex',
                    //     flexDirection: 'row',
                    //     justifyContent: 'space-around',
                    //     marginBottom: '8%',
                    // }}
                    ></div>

                    {buttonSelccionado === 1 ? (
                        <FormIngresarExcelGeneral />
                    ) : buttonSelccionado === 2 ? (
                        <FormIngresarExcelAportacion />
                    ) : (
                        <FormIngresarExcelParametrizacion />
                    )}
                </Box>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoMigracion
