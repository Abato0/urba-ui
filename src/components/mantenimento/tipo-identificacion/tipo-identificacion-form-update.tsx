import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState, FC } from 'react'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import Fuse from 'fuse.js'
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
    Table,
    TableContainer,
} from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import ModalAuth from '../../core/input/dialog/modal-dialog'
import {
    IResultQueryTipoIdentificacion,
    useGetTipoIdentificacionQuery,
    useListaTipoIdentificacionQuery,
    usePutTipoIdentificacionMutation,
} from './use-tipo-identificacion'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            //   marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            //   marginLeft: theme.spacing(20),
            //   marginRight: theme.spacing(20),
            padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            //   justifyContent:""
            //   height: "100%",
            // width:"100px"
        },
        formControl: {
            // margin: theme.spacing(1),
            minWidth: 220,
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: theme.spacing(6),
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
        dropzone: {
            padding: theme.spacing(4),
            minWidth: 500,
        },
        button: {
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
                color: 'white',
            },
            color: 'white',
        },

        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
        },
        contentLastTextBox: {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
        },
        title: {
            fontSize: theme.typography.pxToRem(12),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
        },

        container: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        },
    })
)

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['id', 'tipo_identificacion'],
}

// const initialValues = Object.freeze({
//   tipo_identificacion: "",
// });

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    tipo_identificacion: yup.string().required('Campo requerido'),
})

interface IProps {
    tipoId: IResultQueryTipoIdentificacion
}

const TipoIdentificacionFormEditar: FC<IProps> = ({ tipoId }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)
    const [dataTipoIdentificacion, setDataTipoIdentificacion] =
        useState<IResultQueryTipoIdentificacion>()

    const [boolPut, setBoolPut] = useState<boolean>(false)

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({
                    pathname: '/mantenimiento/tipo-identificacion/registrar',
                })
            })
        }
        // }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boolPut, openModalMsj, router])

    const id = useMemo(() => {
        if (isNotNilOrEmpty(router.query.id)) {
            return Number(router.query.id)
        }
    }, [router.query.id])

    const { data, loading, error } = useGetTipoIdentificacionQuery(id)

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setDataTipoIdentificacion(data?.GetTipoIdentificacion)
        }
    }, [loading, error, data])

    const { refetch } = useListaTipoIdentificacionQuery()

    const [mutate] = usePutTipoIdentificacionMutation()

    const onSubmit = useCallback(
        async ({ tipo_identificacion }) => {
            try {
                if (isNotNilOrEmpty(tipo_identificacion)) {
                    setLoadingMutate(true)
                    const { data } = await mutate({
                        variables: {
                            id: tipoId.id,
                            tipo_identificacion,
                        },
                    })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = data.PutTipoIdentificacion
                        setTitleModalMsj(message)
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        // if (isNotNilOrEmpty(data.PutParentesco)) {
                        //   setBoolPut(true);
                        // }
                        if (code === 200) {
                            setErrorModal(false)
                            setBoolPut(true)
                        }
                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(false)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
            } catch (error) {
                console.log('error.;', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'El Tipo de identificacion no ha sido guardado: ' +
                    (error as Error).message
                )
                setOpenModalMsj(true)
                setLoadingMutate(false)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mutate, refetch]
    )

    const initialValues = useMemo(() => {
        if (tipoId) {
            return {
                tipo_identificacion: tipoId.tipo_identificacion,
            }
        } else {
            return {
                tipo_identificacion: '',
            }
        }
    }, [tipoId])

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        resetForm,
    } = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    })

    return (
        <>
            {!loading &&
                isNotNilOrEmpty(dataTipoIdentificacion) &&
                isNotNilOrEmpty(id) && (
                    <div>
                        {openModalMsj && (
                            <ModalAuth
                                openModal={openModalMsj}
                                setOpenModal={setOpenModalMsj}
                                title={titleModalMsj}
                                message={mensajeModalMsj}
                                error={errorModal}
                            />
                        )}
                        <Box className={classes.root}>
                            <div className={classes.title}>
                                <Typography variant="overline">
                                    {`Actulización de tipo de identificación: ${tipoId.tipo_identificacion}`}
                                </Typography>
                            </div>

                            <form
                                action="#"
                                onSubmit={handleSubmit}
                                onReset={handleReset}
                                className={classes.form}
                            >
                                <div className={classes.contentLastTextBox}>
                                    <TextField
                                        className={classes.textbox}
                                        variant="outlined"
                                        id="tipo_identificacion"
                                        value={values.tipo_identificacion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Tipo de Identificacion"
                                        margin="normal"
                                        error={
                                            touched.tipo_identificacion &&
                                            isNotNilOrEmpty(
                                                errors.tipo_identificacion
                                            )
                                        }
                                        helperText={
                                            touched.tipo_identificacion
                                                ? errors.tipo_identificacion
                                                : undefined
                                        }
                                        required
                                    />
                                </div>
                                <div className={classes.contentButtons}>
                                    <div></div>
                                    <LoadingButton
                                        loading={loadingMutate}
                                        loadingPosition="start"
                                        type="submit"
                                        variant="outlined"
                                        startIcon={<SaveIcon />}
                                    >
                                        Guardar
                                    </LoadingButton>
                                </div>
                            </form>
                        </Box>
                    </div>
                )}
        </>
    )
}

export default TipoIdentificacionFormEditar
