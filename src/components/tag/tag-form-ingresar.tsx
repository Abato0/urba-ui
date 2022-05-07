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
import {
    IResultQueryTag,
    usePostTagMutation,
    usePutTagMutation,
    useListaAllTag,
} from './use-tag'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ModalAuth from '../core/input/dialog/modal-dialog'
import { LoadingButton } from '@mui/lab'
import SaveIcon from '@material-ui/icons/Save'

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
            marginTop: theme.spacing(2),
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
    code: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    code: yup.string().required('Campo requerido'),
})

interface IProps {
    tag?: IResultQueryTag
    id?: number
}

export const IngresarTagForm: FC<IProps> = ({ tag, id }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const { refetch } = useListaAllTag()

    useEffect(() => {
        // setTimeout(() => {
        if (!openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/tag/listado-tags' })
            })
        }
        // }, 2000);
    }, [boolPut, openModalMsj, refetch, router])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mutate] = isNil(tag) ? usePostTagMutation() : usePutTagMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(tag)
            ? {
                  code: tag?.code,
              }
            : initialValues
    }, [tag])

    const onSubmit = useCallback(
        async ({ code }) => {
            try {
                if (isNotNilOrEmpty(code)) {
                    setLoadingMutate(true)
                    const { data } = isNil(tag)
                        ? await mutate({
                              variables: {
                                  code,
                              },
                          })
                        : await mutate({
                              variables: {
                                  id,
                                  code,
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        setLoadingMutate(false)
                        const { code, message } = isNotNilOrEmpty(data.PostTag)
                            ? data.PostTag
                            : data.PutTag
                        setTitleModalMsj(message)

                        setOpenModalMsj(true)
                        if (isNotNilOrEmpty(data.PutTag)) {
                            setBoolPut(true)
                        }
                        if (code === 200) {
                            setErrorModal(false)
                        }
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
                    'El tag no ha sido guardado: ' + error.message
                )
                setOpenModalMsj(true)
            }
        },
        [id, mutate, tag]
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
                    setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
            {tag && (
                <div className={classes.title}>
                    <Typography variant="overline">{`Actualización de tag: ${tag.code}`}</Typography>
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
                        id="code"
                        value={values.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Codigo del Tag"
                        margin="normal"
                        error={touched.code && isNotNilOrEmpty(errors.code)}
                        helperText={touched.code ? errors.code : undefined}
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
