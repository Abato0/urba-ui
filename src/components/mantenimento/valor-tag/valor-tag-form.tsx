/* eslint-disable react-hooks/rules-of-hooks */
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { isNil } from 'ramda'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { Paper } from '@material-ui/core'
import {
    IResultQueryValorTag,
    useListadoValorTag,
    usePostValorTag,
    usePutValorTag,
} from './use-valor-tag'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import ModalAuth from '../../core/input/dialog/modal-dialog'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
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
            flexDirection: 'column',
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
        containerPaper: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginBottom: theme.spacing(3),
        },
        paperValorTag: {
            backgroundColor: colors.purple[50],
            padding: theme.spacing(2),
        },
        labelValorTag: {
            fontWeight: 'bold',
        },
    })
)

const initialValues = Object.freeze({
    tipo_tag: '',
    valor: undefined,
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    tipo_tag: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    valor: yup
        .number()
        .min(0, 'Valores no pueden ser negativos')
        .required('Campo requerido'),
})

interface IProps {
    valorTagObj?: IResultQueryValorTag
    id?: number
}

export const IngresarValorTagForm: FC<IProps> = ({ id, valorTagObj }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    // const { refetch } = useListadoValorTag()

    const init = useMemo(() => {
        return isNotNilOrEmpty(valorTagObj)
            ? {
                  tipo_tag: valorTagObj?.tipo_tag,
                  valor: valorTagObj?.valor,
              }
            : initialValues
    }, [valorTagObj])

    const onCloseModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/mantenimiento/valor-tag/listado' })
            // })
        } else {
            setOpenModalMsj(false)
        }
    }

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         refetch().then(() => {
    //             router.push({ pathname: '/mantenimiento/valor-tag/listado' })
    //         })
    //     }
    //     // }, 2000);
    // }, [boolPut, openModalMsj])

    // const { data, loading, error } = useGetValorTagQuery();

    const [mutate] = isNilOrEmpty(valorTagObj)
        ? usePostValorTag()
        : usePutValorTag()

    const onSubmit = useCallback(
        async ({ tipo_tag, valor }) => {
            try {
                if (isNotNilOrEmpty(valor) && isNotNilOrEmpty(tipo_tag)) {
                    setLoadingMutate(true)
                    const { data } = isNilOrEmpty(valorTagObj)
                        ? await mutate({
                              variables: {
                                  tipo_tag: String(tipo_tag).toUpperCase(),
                                  valor,
                              },
                          })
                        : await mutate({
                              variables: {
                                  id: Number(id),
                                  tipo_tag: String(tipo_tag).toUpperCase(),
                                  valor,
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = isNilOrEmpty(valorTagObj)
                            ? data.PostValorTag
                            : data.PutValorTag
                        setLoadingMutate(false)
                        setTitleModalMsj(message)
                        setErrorModal(code === 200 ? false : true)

                        if (code === 200) {
                            if (
                                isNotNilOrEmpty(data.PutValorTag) &&
                                code === 200
                            ) {
                                setBoolPut(true)
                                return
                            }
                            // await refetch()
                            resetForm()
                        }
                        setOpenModalMsj(true)

                        // if (isNotNilOrEmpty(data.PutValorTag) && code === 200) {
                        //     setBoolPut(true)
                        // } else if (
                        //     isNotNilOrEmpty(data.PostValorTag) &&
                        //     code === 200
                        // ) {
                        //     await refetch()
                        // }

                        // resetForm();
                    } else {
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(false)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
            } catch (error: any) {
                setLoadingMutate(false)
                console.log('error.;', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(
                    'La marca no ha sido guardado: ' + error.message
                )
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, valorTagObj]
    )

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
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={onCloseModalAuth}
                    // setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <div className={classes.title}>
                <Typography variant="overline">
                    {valorTagObj
                        ? `Actualización del valor del tag: ${valorTagObj.tipo_tag}`
                        : 'Registro del valor del Tag'}
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
                        id="tipo_tag"
                        value={values.tipo_tag}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Tipo de Tag"
                        margin="normal"
                        error={
                            touched.tipo_tag && isNotNilOrEmpty(errors.tipo_tag)
                        }
                        helperText={
                            touched.tipo_tag ? errors.tipo_tag : undefined
                        }
                        required
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                </div>
                <div className={classes.contentLastTextBox}>
                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="valor"
                        type={'number'}
                        value={values.valor}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Valor del Tag"
                        margin="normal"
                        error={touched.valor && isNotNilOrEmpty(errors.valor)}
                        helperText={touched.valor ? errors.valor : undefined}
                        required
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                </div>
                <div className={classes.contentButtons}>
                    <div></div>
                    <LoadingButton
                        loading={loadingMutate}
                        loadingPosition="start"
                        type="submit"
                        variant="text"
                        startIcon={<SaveIcon />}
                    >
                        Guardar
                    </LoadingButton>
                </div>
            </form>
        </Box>
    )
}
