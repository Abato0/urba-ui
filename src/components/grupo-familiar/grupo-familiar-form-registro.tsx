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
import { saveGrupoFamiliar } from '../../components/grupo-familiar/grupo-familiar-typeDefs'
import {
    useGrupoFamiliarMutation,
    useListarGrupoFamiliarFilterQuery,
    useUpdateFamiliarMutation,
} from '../../components/grupo-familiar/use-grupo-familia'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { DocumentNode } from '@apollo/client'
import { equals, isEmpty, isNil, omit } from 'ramda'
import {
    IGrupoFamiliar,
    IGrupoFamiliarInput,
} from '../../interface/grupo-familiar.interface'
import ModalAuth from '../core/input/dialog/modal-dialog'

import FormControlHeader from '../core/input/form-control-select'
import {
    useListaCallesQuery,
    usePostCalleMutation,
} from '../mantenimento/calle/use-calle'
import { useListaManzanaQuery } from '../mantenimento/manzana/use-manzana'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'
import {
    useListadoUsuario,
    useListadoUsuarioSinFamilares,
} from '../usuarios/use-usuario'
import { GetGrupoFamiliar } from './grupo-familiar-typeDefs'

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
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
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
    })
)

const initialValues = Object.freeze({
    nombre_familiar: '',
    id_calle_principal: 0,
    calle_interseccion: '',
    id_manzana: 0,
    villa: 0,
    id_usuario: undefined,
    // id_tipo_edificacion: 0,
    // id_color_fachada: 0,
})

const validationSchema = yup.object().shape({
    nombre_familiar: yup.string().required('Requerido'),
    id_manzana: yup.number().required('Requerido'),
    villa: yup.number().required('Requerido'),
    id_calle_principal: yup.number().required('Requerido'),
    calle_interseccion: yup.string().required('Requerido'),
    id_usuario: yup.number().required('Requerido'),
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

    const { refetch } = useListarGrupoFamiliarFilterQuery({})
    const [mutate, loading, error] = isNil(grupoFam)
        ? useGrupoFamiliarMutation(mutation)
        : useUpdateFamiliarMutation(mutation)

    const {
        data: dataListadoManzana,
        loading: loadingListadoManzana,
        error: errorListadoManzana,
    } = useListaManzanaQuery()

    const {
        data: dataListadoCalles,
        loading: loadingListadoCalles,
        error: errorListadoCalles,
    } = useListaCallesQuery()

    const {
        data: dataListadoUsuarios,
        loading: loadingListadoUsuario,
        error: errorListadoUsuario,
    } = useListadoUsuario()

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/grupo-familiar/listado' })
            })
        }
        // }, 2000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boolPut, openModalMsj])

    const onSubmit = useCallback(
        async (
            {
                nombre_familiar,
                id_calle_principal,
                id_usuario,
                calle_interseccion,
                id_manzana,
                villa,
                // id_tipo_edificacion,
                // id_color_fachada,
            },
            { setSubmitting }
        ) => {
            try {
                if (
                    isNotNilOrEmpty(nombre_familiar) &&
                    isNotNilOrEmpty(id_calle_principal) &&
                    !equals(id_calle_principal, 0) &&
                    isNotNilOrEmpty(calle_interseccion) &&
                    isNotNilOrEmpty(id_manzana) &&
                    !equals(id_manzana, 0) &&
                    isNotNilOrEmpty(villa) &&
                    isNotNilOrEmpty(id_usuario) &&
                    !equals(id_usuario, 0)
                    // isNotNilOrEmpty(id_tipo_edificacion) &&
                    // !equals(id_tipo_edificacion, 0) &&
                    // isNotNilOrEmpty(id_color_fachada) &&
                    // !equals(id_color_fachada, 0)
                ) {
                    setLoadingMutate(true)
                    const { data: dataMutate } = isNil(grupoFam)
                        ? await mutate({
                            variables: {
                                nombre_familiar,
                                id_calle_principal,
                                calle_interseccion,
                                id_manzana,
                                id_usuario,
                                villa,
                                // id_tipo_edificacion,
                                // id_color_fachada,
                            },
                        })
                        : await mutate({
                            variables: {
                                id: idGrupoFamiliar,
                                nombre_familiar,
                                id_calle_principal,
                                calle_interseccion,
                                id_manzana,
                                id_usuario,
                                villa,
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
                        if (
                            isNotNilOrEmpty(dataMutate.UpdateGrupoFamiliar) &&
                            code === 200
                        ) {
                            setBoolPut(true)
                        }

                        // resetForm();
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
        isSubmitting,
        touched,
        values,
        resetForm,
    } = useFormik({
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    const classes = useStyles()
    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    setOpenModal={setOpenModalMsj}
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
                <div className={classes.contentLastTextBox}>
                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="nombre_familiar"
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
                    </FormControlHeader>
                </div>

                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_calle_principal"
                        handleChange={handleChange}
                        labetTitulo="Calle Principal"
                        value={values.id_calle_principal}
                    >
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
                    >
                        {!loadingListadoCalles &&
                            !isNil(dataListadoCalles) &&
                            dataListadoCalles.ListaCalle.map(({ calle }) => {
                                return (
                                    <MenuItem
                                        key={
                                            'ingresoGrupoFamiliar-calle-interseccion' +
                                            calle
                                        }
                                        value={calle}
                                    >
                                        {calle}
                                    </MenuItem>
                                )
                            })}
                    </FormControlHeader>
                </div>

                <div className={classes.contentLastTextBox}>
                    <FormControlHeader
                        classes={classes}
                        handleBlur={handleBlur}
                        id="id_manzana"
                        handleChange={handleChange}
                        labetTitulo="Manzana"
                        value={values.id_manzana}
                    >
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
                                        >
                                            {manzana}
                                        </MenuItem>
                                    )
                                }
                            )}
                    </FormControlHeader>

                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="villa"
                        value={values.villa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="villa"
                        label="Numero de lote (Villa)"
                        margin="normal"
                        type={'number'}
                        error={touched.villa && isNotNilOrEmpty(errors.villa)}
                        helperText={touched.villa ? errors.villa : undefined}
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
            </form>
        </Box>
    )
}

export default GrupoFamiliarFormRegistro
