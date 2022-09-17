/* eslint-disable react-hooks/rules-of-hooks */
import * as yup from 'yup'
import {
    makeStyles,
    createStyles,
    colors,
    Box,
    TextField,
    MenuItem,
    Typography,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import {
    useGrupoFamiliarMutation,
    useListarGrupoFamiliarFilterQuery,
    useUpdateFamiliarMutation,
} from '../../components/grupo-familiar/use-grupo-familia'
import { FC, useCallback, useMemo, useState } from 'react'
import { DocumentNode } from '@apollo/client'
import { equals, isNil } from 'ramda'
import { IGrupoFamiliarInput } from '../../interface/grupo-familiar.interface'
import ModalAuth from '../core/input/dialog/modal-dialog'

import FormControlHeader from '../core/input/form-control-select'
import { useListaCallesQuery } from '../mantenimento/calle/use-calle'
import { useListaManzanaQuery } from '../mantenimento/manzana/use-manzana'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // display: "flex",
            // backgroundColor:"red",
            marginTop: theme.spacing(10),
            marginBottom: theme.spacing(10),
            marginLeft: theme.spacing(10),
            marginRight: theme.spacing(10),
            padding: '60px',
            // minWidth: "820px",
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: 'white',
            // width:600,
            // justifyContent: "center",
            // alignContent: "center"
            // minWidth:600
            // width:"100px"
        },

        form: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',

            marginTop: theme.spacing(3),
        },
        button: {
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
                color: 'white',
            },
            color: 'white',
        },
        contentLastTextBox: {
            // display: 'flex',
            // flexDirection: 'row',
            // alignContent: 'center',
        },
        textbox: {
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: theme.spacing(5),
        },
        formControl: {
            // margin: theme.spacing(1),
            minWidth: 220,
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
        input: {
            '& input[type=number]': {
                '-moz-appearance': 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
                margin: 0,
            },
            margin: theme.spacing(1),
            width: theme.spacing(29),
        },
    })
)

const initialValues = Object.freeze({
    nombre_familiar: '',
    id_calle_principal: 0,
    calle_interseccion: '0',
    id_manzana: 0,
    villa: 1,
    extension: '',
    // id_usuario: undefined,
    // id_tipo_edificacion: 0,
    // id_color_fachada: 0,
})

const validationSchema = yup.object().shape({
    nombre_familiar: yup
        .string()
        .matches(/^[aA-zZ\s]+([0-9]{1})?$/, 'No colocar caracteres especiales')
        .required('Campor requerido'),
    id_manzana: yup
        .number()
        .required('Campo requerido')
        .min(1, 'Campo requerido'),
    villa: yup
        .number()
        .min(1, 'No se acepta 0 o numeros negativos')
        .required('Campo requerido'),
    id_calle_principal: yup
        .number()
        .required('Campo requerido')
        .min(1, 'Campo requerido'),
    calle_interseccion: yup
        .string()

        //  .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
        .required('Campo Requerido')
        .min(2, 'Campo requerido'),
    extension: yup.string(),
    // .matches(/^[aA-zZ\s]+$/, 'No colocar caracteres especiales')
    // .max(4, 'Excede la cantidad de caracteres permitidos'),
    // .nullable(),
    // id_usuario: yup.number().required('Requerido'),
    // id_color_fachada: yup.number().required("Requerido"),
    // id_tipo_edificacion: yup.number().required("Requerido"),
})

interface IProps {
    mutation: DocumentNode
    grupoFam?: IGrupoFamiliarInput
    idGrupoFamiliar?: number
    // nombre_familiar?: string;
    // celular?: string;
}

const GrupoFamiliarFormRegistro: FC<IProps> = ({
    mutation,
    grupoFam,
    idGrupoFamiliar,
}) => {
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [boolPut, setBoolPut] = useState<boolean>(false)

    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    // const { refetch } = useListarGrupoFamiliarFilterQuery({})
    const [mutate] = isNil(grupoFam)
        ? useGrupoFamiliarMutation(mutation)
        : useUpdateFamiliarMutation(mutation)

    const onCloseModalAuth = () => {
        if (openModalMsj && boolPut) {
            // refetch().then(() => {
            router.push({ pathname: '/grupo-familiar/listado' })
            // })

            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    const { data: dataListadoManzana, loading: loadingListadoManzana } =
        useListaManzanaQuery()

    const { data: dataListadoCalles, loading: loadingListadoCalles } =
        useListaCallesQuery()

    // const {
    //     data: dataListadoUsuarios,
    //     loading: loadingListadoUsuario,
    //     error: errorListadoUsuario,
    // } = useListadoUsuario()

    // useEffect(() => {
    //     // setTimeout(() => {
    //     if (!openModalMsj && boolPut) {
    //         refetch().then(() => {
    //             router.push({ pathname: '/grupo-familiar/listado' })
    //         })
    //     }
    //     // }, 2000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boolPut, openModalMsj])

    const onSubmit = useCallback(
        async ({
            nombre_familiar,
            id_calle_principal,
            // id_usuario,
            calle_interseccion,
            id_manzana,
            villa,
            extension,
            // id_tipo_edificacion,
            // id_color_fachada,
        }) => {
            try {
                console.log('Entre')
                if (
                    isNotNilOrEmpty(nombre_familiar) &&
                    isNotNilOrEmpty(id_calle_principal) &&
                    !equals(id_calle_principal, 0) &&
                    isNotNilOrEmpty(calle_interseccion) &&
                    !equals(calle_interseccion, '0') &&
                    isNotNilOrEmpty(id_manzana) &&
                    !equals(id_manzana, 0) &&
                    isNotNilOrEmpty(villa)
                    // isNotNilOrEmpty(id_usuario) &&
                    // !equals(id_usuario, 0)
                    // isNotNilOrEmpty(id_tipo_edificacion) &&
                    // !equals(id_tipo_edificacion, 0) &&
                    // isNotNilOrEmpty(id_color_fachada) &&
                    // !equals(id_color_fachada, 0)
                ) {
                    setLoadingMutate(true)
                    const { data: dataMutate } = isNil(grupoFam)
                        ? await mutate({
                              variables: {
                                  nombre_familiar: String(nombre_familiar)
                                      .toUpperCase()
                                      .trim(),
                                  id_calle_principal,
                                  calle_interseccion:
                                      String(calle_interseccion).toUpperCase(),
                                  id_manzana,
                                  // id_usuario,
                                  villa,
                                  extension: extension
                                      ? String(extension).toUpperCase().trim()
                                      : '',
                                  // id_tipo_edificacion,
                                  // id_color_fachada,
                              },
                          })
                        : await mutate({
                              variables: {
                                  id: idGrupoFamiliar,
                                  nombre_familiar: String(nombre_familiar)
                                      .toUpperCase()
                                      .trim(),
                                  id_calle_principal,
                                  calle_interseccion:
                                      String(calle_interseccion).toUpperCase(),
                                  id_manzana,
                                  // id_usuario,
                                  villa,
                                  extension: extension
                                      ? String(extension).toUpperCase().trim()
                                      : '',
                                  // id_tipo_edificacion,
                                  // id_color_fachada,
                              },
                          })
                    if (
                        (isNotNilOrEmpty(dataMutate) &&
                            isNotNilOrEmpty(dataMutate.PostGrupoFamiliar)) ||
                        isNotNilOrEmpty(dataMutate.UpdateGrupoFamiliar)
                    ) {
                        const { code, message } = isNotNilOrEmpty(
                            dataMutate.PostGrupoFamiliar
                        )
                            ? dataMutate.PostGrupoFamiliar
                            : dataMutate.UpdateGrupoFamiliar

                        setTitleModalMsj(message)
                        setErrorModal(false)
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        setErrorModal(code === 200 ? false : true)

                        if (code === 200) {
                            if (
                                isNotNilOrEmpty(dataMutate.UpdateGrupoFamiliar)
                            ) {
                                setBoolPut(true)
                                return
                            }
                            // await refetch()
                            resetForm()
                        }

                        // resetForm();
                        // return
                    } else if (dataMutate === null) {
                        setOpenModalMsj(true)
                        setTitleModalMsj('Usuario no autorizado')
                    }
                }
                // console.log("data: ", data, "loading: ", loading, "error: ", error);
            } catch (err) {
                setLoadingMutate(false)
                // console.log("error : ", err);
                setTitleModalMsj('Grupo Familiar no Registrado')
                setErrorModal(true)
                // setMensajeModalMsj(
                //   "Ha ocurrido un erro al resgistrar el grupo familiar: "
                // );
                setOpenModalMsj(true)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [grupoFam, idGrupoFamiliar]
    )

    const init = useMemo(() => {
        return !isNil(grupoFam) ? grupoFam : initialValues
    }, [grupoFam])

    const {
        errors,
        handleBlur,
        handleChange,
        handleReset,
        handleSubmit,
        touched,
        values,
        resetForm,
    } = useFormik({
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    // useEffect(() => {
    //     if (
    //         (!values.calle_interseccion ||
    //             values.calle_interseccion.length === 0) &&
    //         !loadingListadoCalles &&
    //         dataListadoCalles &&
    //         dataListadoCalles.ListaCalle &&
    //         dataListadoCalles.ListaCalle.length > 0
    //     ) {
    //         setFieldValue(
    //             'calle_interseccion',
    //             dataListadoCalles.ListaCalle[0].calle
    //         )
    //     }
    // }, [loadingListadoCalles, dataListadoCalles, values])

    // useEffect(() => {
    //     console.log('Values: ', values)
    // }, [values])

    const classes = useStyles()
    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={() => {
                        onCloseModalAuth()
                    }}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            {grupoFam && (
                <div className={classes.title}>
                    <Typography variant="overline">
                        {`Actualización de grupo familiar: ${grupoFam.nombre_familiar}`}
                    </Typography>
                </div>
            )}
            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <div
                    className={classes.contentLastTextBox}
                    style={{
                        width: '100%',
                    }}
                >
                    <TextField
                        className={classes.textbox}
                        style={{
                            width: '95%',
                        }}
                        variant="outlined"
                        id="nombre_familiar"
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        value={values.nombre_familiar}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="nombre_familia"
                        label="Nombre del Grupo Familiar"
                        margin="normal"
                        error={
                            touched.nombre_familiar &&
                            isNotNilOrEmpty(errors.nombre_familiar)
                        }
                        helperText={
                            touched.nombre_familiar
                                ? errors.nombre_familiar
                                : undefined
                        }
                        required
                    />
                    {/*
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_usuario"
                        handleChange={handleChange}
                        labetTitulo="Usuario"
                        value={values.id_usuario}
                    >
                        {!loadingListadoUsuario &&
                            !isNil(dataListadoUsuarios) &&
                            dataListadoUsuarios.ListaUsuario.map(
                                ({ id, user }, index) => {
                                    return (
                                        <MenuItem
                                            key={id}
                                            value={id}
                                            selected={
                                                id === grupoFam?.id_usuario
                                            }
                                        >
                                            {user}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader> */}
                </div>

                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_calle_principal"
                        handleChange={handleChange}
                        labetTitulo="Calle Principal"
                        value={values.id_calle_principal}
                        error={errors.id_calle_principal}
                    >
                        <MenuItem value={0}> SELECCIONAR</MenuItem>
                        {!loadingListadoCalles &&
                            !isNil(dataListadoCalles) &&
                            dataListadoCalles.ListaCalle.map(
                                ({ id, calle }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'ingresoGrupoFamiliar-calle-principal' +
                                                id
                                            }
                                            style={{
                                                textTransform: 'uppercase',
                                            }}
                                            value={id}
                                        >
                                            {calle}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>

                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="calle_interseccion"
                        handleChange={handleChange}
                        labetTitulo="Calle Intersección"
                        value={values.calle_interseccion}
                        error={errors.calle_interseccion}
                    >
                        <MenuItem value={'0'}>SELECCIONAR</MenuItem>
                        {!loadingListadoCalles &&
                            !isNil(dataListadoCalles) &&
                            dataListadoCalles.ListaCalle.map(
                                ({ id, calle }) => {
                                    return (
                                        <MenuItem
                                            key={
                                                'ingresoGrupoFamiliar-calle-interseccion' +
                                                id
                                            }
                                            style={{
                                                textTransform: 'uppercase',
                                            }}
                                            value={calle}
                                        >
                                            {calle}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>
                </div>

                <>
                    <div className={classes.contentLastTextBox}>
                        <FormControlHeader
                            classes={classes}
                            handleBlur={handleBlur}
                            id="id_manzana"
                            handleChange={handleChange}
                            labetTitulo="Manzana"
                            value={values.id_manzana}
                            error={errors.id_manzana}
                        >
                            <MenuItem value={0}> SELECCIONAR</MenuItem>
                            {!loadingListadoManzana &&
                                !isNil(dataListadoManzana) &&
                                dataListadoManzana.ListaManzana.map(
                                    ({ id, manzana }) => {
                                        return (
                                            <MenuItem
                                                key={
                                                    'ingresoGrupoFamiliar-manzana' +
                                                    id
                                                }
                                                value={id}
                                                style={{
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {manzana}
                                            </MenuItem>
                                        )
                                    }
                                )}
                        </FormControlHeader>

                        <TextField
                            className={classes.input}
                            style={{ width: 108 }}
                            variant="outlined"
                            id="villa"
                            value={values.villa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="villa"
                            label="Núm. de lote"
                            margin="normal"
                            type={'number'}
                            InputProps={{ inputProps: { min: 1 } }}
                            InputLabelProps={{
                                style: {
                                    fontSize: 14,
                                    textAlign: 'left',
                                },
                            }}
                            error={
                                touched.villa && isNotNilOrEmpty(errors.villa)
                            }
                            helperText={
                                touched.villa ? errors.villa : undefined
                            }
                            required
                        />

                        <TextField
                            className={classes.textbox}
                            style={{ width: 108 }}
                            variant="outlined"
                            id="extension"
                            value={values.extension}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="extension"
                            label="Extensión"
                            margin="normal"
                            // type={'number'}
                            inputProps={{
                                style: {
                                    textTransform: 'uppercase',
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: 14,
                                },
                            }}
                            error={
                                touched.extension &&
                                isNotNilOrEmpty(errors.extension)
                            }
                            helperText={
                                touched.extension ? errors.extension : undefined
                            }
                            // required
                        />
                    </div>
                </>

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

export default GrupoFamiliarFormRegistro
