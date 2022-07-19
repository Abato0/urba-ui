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
//   import { isNotNilOrEmpty } from "../../../utils/is-nil-empty";
//   import ModalAuth from "../../core/input/dialog/modal-dialog";
import { useRouter } from 'next/router'

import SaveIcon from '@material-ui/icons/Save'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { useCambioContrasenaUsuarioMutation } from './use-usuario'

import { LoadingButton } from '@mui/lab'

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
    })
)

const initialValues = Object.freeze({
    //   user: "",
    password: '',
    newPassword: '',
    passwordConfirmation: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    //   user: yup.string().required("Campo requerido"),
    password: yup.string().required('Campo requerido'),
    newPassword: yup.string().required('Campo requerido'),
    passwordConfirmation: yup
        .string()
        .oneOf(
            [yup.ref('newPassword'), null],
            'Las contraseñas deben ser iguales'
        ),
})

export const CambiarContrasenaUsuarioForm = () => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mutate] = useCambioContrasenaUsuarioMutation()

    const onSubmit = useCallback(async ({ password, newPassword }) => {
        try {
            if (isNotNilOrEmpty(password) && isNotNilOrEmpty(newPassword)) {
                setLoadingMutate(true)
                const { data } = await mutate({
                    variables: {
                        // user,
                        password,
                        newPassword,
                    },
                })

                if (isNotNilOrEmpty(data)) {
                    const { code, message } = data.CambioContrasena
                    setTitleModalMsj(message)
                    setErrorModal(true)
                    if (code === 200) {
                        setErrorModal(false)
                    }
                    setLoadingMutate(false)
                    setOpenModalMsj(true)
                } else {
                    setLoadingMutate(false)
                    setOpenModalMsj(true)
                    setErrorModal(false)
                    setTitleModalMsj('Usuario no autorizado')
                }
            }
        } catch (error: any) {
            console.log('error.;', error)
            setLoadingMutate(false)
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setOpenModalMsj(true)
        }
    }, [mutate])

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
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={() => setOpenModalMsj(false)}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            {/* <div className={classes.title}>
        <Typography variant="overline">Cambio de Contraseña</Typography>
      </div> */}

            <form
                action="#"
                onSubmit={handleSubmit}
                onReset={handleReset}
                className={classes.form}
            >
                <div>
                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type={'password'}
                        label="Contraseña anterior"
                        margin="normal"
                        error={
                            touched.password && isNotNilOrEmpty(errors.password)
                        }
                        helperText={
                            touched.password ? errors.password : undefined
                        }
                        required
                    />
                    <TextField
                        className={classes.textbox}
                        variant="outlined"
                        id="newPassword"
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type={'password'}
                        label="Nueva contraseña"
                        margin="normal"
                        error={
                            touched.newPassword &&
                            isNotNilOrEmpty(errors.newPassword)
                        }
                        helperText={
                            touched.newPassword ? errors.newPassword : undefined
                        }
                        required
                    />
                </div>

                <TextField
                    className={classes.textbox}
                    variant="outlined"
                    id="passwordConfirmation"
                    value={values.passwordConfirmation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={'password'}
                    label="Confirmar contraseña"
                    margin="normal"
                    error={
                        touched.passwordConfirmation &&
                        isNotNilOrEmpty(errors.passwordConfirmation)
                    }
                    helperText={
                        touched.passwordConfirmation
                            ? errors.passwordConfirmation
                            : undefined
                    }
                    required
                />

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
