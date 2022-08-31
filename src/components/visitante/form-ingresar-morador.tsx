import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Grid,
    MenuItem,
    TextField,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { values, isNil } from 'ramda'
import React, { useCallback, useMemo, useState } from 'react'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import FormControlHeader from '../core/input/form-control-select'
import { useListarGrupoFamiliar } from '../grupo-familiar/use-grupo-familia'
import * as yup from 'yup'
import { useFormik } from 'formik'
import FormControlDate from '../core/input/form-control-date'
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import esLocale from 'date-fns/locale/es'
import { FormatLetterCaseUpper } from 'mdi-material-ui'
import DateFnsUtils from '@date-io/date-fns'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import {
    useSaveVisitanteMoradorMutation,
    useUpdateVisianteMoradorMutation,
} from './use-visitante'
import { lightFormat } from 'date-fns'
import { FC } from 'react'
import ModalAuth from '../core/input/dialog/modal-dialog'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // marginTop: theme.spacing(10),
            // marginBottom: theme.spacing(10),
            // marginLeft: theme.spacing(20),
            // marginRight: theme.spacing(20),
            // padding: '60px',
            // // minWidth: "820px",
            // borderRadius: '10px',
            // textAlign: 'center',
            padding: '5%',
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
            marginTop: theme.spacing(2),
            // width: "70%"
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
    })
)

const initialValues = Object.freeze({
    idGrupoFamiliar: undefined,
    nombre_visitante: '',
    descripcion: '',
    fecha_visita: new Date(),
})

const validationSchema = yup.object().shape({
    idGrupoFamiliar: yup.number().required('Campo requerido'),
    nombre_visitante: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    descripcion: yup
        .string()
        .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    fecha_visita: yup.date().required('Campo requerido'),
})

export interface VisitanteMoradorVariables {
    idGrupoFamiliar: number
    nombre_visitante: string
    descripcion: string
    fecha_visita: string
}

interface IProps {
    morador?: VisitanteMoradorVariables
    id?: number
}

export const FormIngresarMorador: FC<IProps> = ({ morador, id }) => {
    const router = useRouter()
    const classes = useStyles()
    const { data: dataListaGrupoFamiliar, loading: loadingListaGrupoFamiliar } =
        useListarGrupoFamiliar()
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const init = useMemo(() => {
        return isNotNilOrEmpty(morador)
            ? {
                  ...morador,
                  fecha_visita: morador?.fecha_visita
                      ? lightFormat(
                            new Date(Number(morador?.fecha_visita!)),
                            'yyyy-MM-dd'
                        )
                      : '',
              }
            : initialValues
    }, [morador])

    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)

    const closeModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/visitantes/listado-morador' })
            // })
            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    const [mutate] = useSaveVisitanteMoradorMutation()

    const [mutateUpdate] = useUpdateVisianteMoradorMutation()

    const onSubmit = useCallback(
        async ({
            idGrupoFamiliar,
            nombre_visitante,
            descripcion,
            fecha_visita,
        }) => {
            try {
                const { data } =
                    morador && id
                        ? await mutateUpdate({
                              variables: {
                                  id,
                                  idGrupoFamiliar,
                                  nombre_visitante:
                                      String(nombre_visitante).toString(),
                                  descripcion: String(descripcion).toString(),
                                  fecha_visita: lightFormat(
                                      new Date(fecha_visita),
                                      'yyyy-MM-dd'
                                  ),
                              },
                          })
                        : await mutate({
                              variables: {
                                  idGrupoFamiliar,
                                  nombre_visitante:
                                      String(nombre_visitante).toString(),
                                  descripcion: String(descripcion).toString(),
                                  fecha_visita: lightFormat(
                                      new Date(fecha_visita),
                                      'yyyy-MM-dd'
                                  ),
                              },
                          })

                if (isNotNilOrEmpty(data)) {
                    const { code, message } = isNotNilOrEmpty(
                        data.PostVisitanteMorador
                    )
                        ? data.PostVisitanteMorador
                        : data.PutVisitanteMorador

                    setTitleModalMsj(message)
                    setLoadingMutate(false)
                    // setOpenModalMsj(true)
                    setErrorModal(code === 200 ? false : true)
                    if (code === 200) {
                        if (isNotNilOrEmpty(data.PutVisitanteMorador)) {
                            setBoolPut(true)
                            setOpenModalMsj(true)
                            return
                        }
                        // await refetch()
                        resetForm()
                    } else {
                        setErrorModal(true)
                    }
                    setOpenModalMsj(true)
                }
            } catch (err: any) {
                setLoadingMutate(false)
                console.log('error : ', err)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj(err.message)
                setOpenModalMsj(true)
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [morador, id]
    )

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        isSubmitting,
        touched,
        setFieldValue,
        resetForm,
        values,
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
                    onClose={closeModalAuth}
                    //  setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            <form
                action="#"
                onSubmit={handleSubmit}
                // onReset={handleReset}
                className={classes.form}
            >
                <div>
                    <div>
                        <FormControlHeader
                            classes={classes}
                            handleBlur={handleBlur}
                            id="idGrupoFamiliar"
                            handleChange={handleChange}
                            labetTitulo=" Grupo Familiar"
                            value={values.idGrupoFamiliar}
                        >
                            {!loadingListaGrupoFamiliar &&
                                !isNil(dataListaGrupoFamiliar) &&
                                isNotNilOrEmpty(
                                    dataListaGrupoFamiliar.ListaGruposFamiliares
                                ) &&
                                dataListaGrupoFamiliar.ListaGruposFamiliares.map(
                                    ({ id, nombre_familiar }) => {
                                        return (
                                            <MenuItem
                                                value={id}
                                                key={
                                                    'ListGrupoFamiliarFormIntegrante-' +
                                                    id
                                                }
                                            >
                                                {nombre_familiar}
                                            </MenuItem>
                                        )
                                    }
                                )}
                        </FormControlHeader>

                        <TextField
                            className={classes.textbox}
                            id="nombre_visitante"
                            name="nombre_visitante"
                            label="Nombre del Visitante"
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nombre_visitante}
                            error={
                                touched.nombre_visitante &&
                                isNotNilOrEmpty(errors.nombre_visitante)
                            }
                            helperText={
                                touched.nombre_visitante
                                    ? errors.nombre_visitante
                                    : undefined
                            }
                            required
                        />
                    </div>
                    <div>
                        <MuiPickersUtilsProvider
                            locale={esLocale}
                            utils={DateFnsUtils}
                        >
                            <KeyboardDatePicker
                                style={{ width: '97%' }}
                                className={classes.textbox}
                                id={'fecha visita'}
                                name={'fecha visita'}
                                label={'Fecha de la Visita'}
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                value={values.fecha_visita}
                                // onChange={handleChange}
                                onChange={(value) =>
                                    setFieldValue('fecha_visita', value)
                                }
                                error={
                                    touched.fecha_visita &&
                                    isNotNilOrEmpty(errors.fecha_visita)
                                }
                                helperText={
                                    touched.fecha_visita
                                        ? errors.fecha_visita
                                        : undefined
                                }
                                disablePast={true}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div>
                        <TextField
                            style={{ width: '97%' }}
                            className={classes.textbox}
                            id="descripcion"
                            name="descripcion"
                            label="Motivo de la visita"
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.descripcion}
                            error={
                                touched.descripcion &&
                                isNotNilOrEmpty(errors.descripcion)
                            }
                            helperText={
                                touched.descripcion
                                    ? errors.descripcion
                                    : undefined
                            }
                            multiline
                            rows={4}
                            required
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
                </div>
            </form>
        </Box>
    )
}
