import {
    makeStyles,
    createStyles,
    colors,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
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
import FormControlHeader from '../core/input/form-control-select'
import { useListaStatusTagQuery } from '../mantenimento/status-tag/use-status-tag'
import { ID_STATUS_TAG_DISPONIBLE } from '../../utils/keys'

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
            padding: '10%',
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
    code: '',
    idStatus: ID_STATUS_TAG_DISPONIBLE,
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    code: yup
        .string()
        .matches(/^[aA-zZ0-9\s]+$/, 'No colocar caracteres especiales')
        .required('Campo requerido'),
    idStatus: yup.number().required('Campo requerido'),
})

interface IProps {
    tag?: IResultQueryTag
    idStatus?: number
}

export const IngresarTagForm: FC<IProps> = ({ tag, idStatus }) => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const { data, loading } = useListaStatusTagQuery()

    const [boolPut, setBoolPut] = useState<boolean>(false)

    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const { refetch } = useListaAllTag()

    const closeModalAuth = () => {
        if (openModalMsj && boolPut) {
            refetch().then(() => {
                router.push({ pathname: '/tag/listado-tags' })
            })

            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mutate] = isNil(tag) ? usePostTagMutation() : usePutTagMutation()

    const init = useMemo(() => {
        return isNotNilOrEmpty(tag)
            ? {
                  code: tag?.code,
                  idStatus: idStatus,
              }
            : initialValues
    }, [tag, idStatus])

    const onSubmit = useCallback(
        async ({ code, idStatus: idStatusTag }) => {
            try {
                if (isNotNilOrEmpty(code)) {
                    setLoadingMutate(true)
                    const { data } = isNil(tag)
                        ? await mutate({
                              variables: {
                                  code,
                                  idStatus: idStatusTag,
                              },
                          })
                        : await mutate({
                              variables: {
                                  id: tag.id,
                                  code,
                                  idStatus: idStatusTag,
                              },
                          })

                    if (isNotNilOrEmpty(data)) {
                        setLoadingMutate(false)
                        const { code, message } = isNotNilOrEmpty(data.PostTag)
                            ? data.PostTag
                            : data.PutTag
                        setTitleModalMsj(message)

                        setOpenModalMsj(true)

                        if (code === 200) {
                            if (isNotNilOrEmpty(data.PutTag)) {
                                setBoolPut(true)
                                return
                            }
                            // await refetch()
                            resetForm()
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mutate, tag]
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
        setFieldValue,
    } = useFormik({
        initialValues: init,
        onSubmit,
        validationSchema,
    })

    // useEffect(() => {
    //     if (!tag) {
    //         // setLoadingMutate(true)
    //         setFieldValue('idStatus', ID_STATUS_TAG_DISPONIBLE)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [tag])

    return (
        <Box className={classes.root}>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    onClose={() => {
                        closeModalAuth()
                    }}
                    //    setOpenModal={setOpenModalMsj}
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
                    <div>
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
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                    </div>
                    {tag && (
                        <div>
                            <FormControlHeader
                                classes={classes}
                                handleBlur={handleBlur}
                                id="idStatus"
                                handleChange={handleChange}
                                labetTitulo="Status del Tag"
                                value={values.idStatus}
                            >
                                {!loading &&
                                    data &&
                                    isNotNilOrEmpty(data.ListaStatusTag) &&
                                    data.ListaStatusTag.map(
                                        ({ id, statusTag }) => {
                                            return (
                                                <MenuItem key={id} value={id}>
                                                    <Typography
                                                        variant="inherit"
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                    >
                                                        {statusTag}
                                                    </Typography>
                                                </MenuItem>
                                            )
                                        }
                                    )}
                            </FormControlHeader>
                        </div>
                    )}
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
