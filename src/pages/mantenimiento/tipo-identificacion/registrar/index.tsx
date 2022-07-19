import AppLayout from '../../../../components/layout/app-layout'
// import { IngresarParentescoForm } from "../../../../components/mantenimento/parentesco/parentesco-form";
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
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    useDeleteTipoIdentificacionMutation,
    useListaTipoIdentificacionQuery,
    usePostTipoIdentificacionMutation,
} from '../../../../components/mantenimento/tipo-identificacion/use-tipo-identificacion'
import { useFormik } from 'formik'
import ModalAuth from '../../../../components/core/input/dialog/modal-dialog'
import {
    isNilOrEmpty,
    isNotNil,
    isNotNilOrEmpty,
} from '../../../../utils/is-nil-empty'
import { isNil, pluck, prop } from 'ramda'
import Fuse from 'fuse.js'
import { IResultQueryTipoIdentificacion } from '../../../../components/mantenimento/tipo-identificacion/use-tipo-identificacion'
import CardTableBody from '../../../../components/table/table-body'
import TableHeader from '../../../../components/table/table-header'
import TablePaginations from '../../../../components/table/table-paginations'
import { useTable, usePagination } from 'react-table'
import { columnsTipoIdentificacion } from '../../../../components/mantenimento/tipo-identificacion/tipo-identificacion-dataTable'
import useDebounce from '../../../../utils/useDebounce'

import { LoadingButton } from '@mui/lab'
import SaveIcon from '@mui/icons-material/Save'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import NavBar from '../../../../components/layout/app-bar'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../../utils/styles'

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

const initialValues = Object.freeze({
    tipo_identificacion: '',
})

const validationSchema = yup.object().shape({
    //   id_aporte: yup.number().required(),
    tipo_identificacion: yup.string().required('Campo requerido'),
})

const getRowId: any = prop('id')

const MantenimientoTipoIdentificacionIngresar = () => {
    const classes = useStyles()
    const router = useRouter()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [mutate] = usePostTipoIdentificacionMutation()
    const [mutateEliminar] = useDeleteTipoIdentificacionMutation()
    const [search, setSearch] = useState<string>('')
    const [loadingMutate, setLoadingMutate] = useState<boolean>(false)

    const debounceSearch = useDebounce(search, 300)

    const { data, loading, refetch, error } = useListaTipoIdentificacionQuery()

    const [dataTipoID, setDataTipoID] = useState<
        IResultQueryTipoIdentificacion[]
    >([])

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataTipoID(data?.ListaTipoIdentificacion ?? [])
            //   setDataParentesco(extractData(data?.ListaParentesco!));
        }
    }, [data, loading, error])

    const onSubmit = useCallback(
        async ({ tipo_identificacion }) => {
            try {
                if (isNotNilOrEmpty(tipo_identificacion)) {
                    setLoadingMutate(true)
                    const { data } = await mutate({
                        variables: {
                            tipo_identificacion,
                        },
                    })

                    if (isNotNilOrEmpty(data)) {
                        const { code, message } = data.PostTipoIdentificacion
                        setTitleModalMsj(message)
                        setLoadingMutate(false)
                        setOpenModalMsj(true)
                        // if (isNotNilOrEmpty(data.PutParentesco)) {
                        //   setBoolPut(true);
                        // }
                        if (code === 200) {
                            setErrorModal(false)
                            await refetch()
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
        [mutate, refetch]
    )

    const onEdit = useCallback(
        ({ id }: any) => {
            if (!isNil(id)) {
                router.push(
                    {
                        pathname:
                            '/mantenimiento/tipo-identificacion/registrar/[id]',
                    },
                    `/mantenimiento/tipo-identificacion/registrar/${encodeURIComponent(
                        id
                    )}`
                )
            }
        },
        [router]
    )

    const onDelete = useCallback(
        async ({ id }: any) => {
            try {
                const { data } = await mutateEliminar({
                    variables: {
                        id,
                    },
                })
                if (isNotNil(data)) {
                    const { code, message } = data.DeleteTipoIdentificacion
                    setTitleModalMsj(message)
                    if (code === 200) {
                        setErrorModal(false)
                        await refetch()
                        resetForm()
                    }
                    //   setErrorModal(false);
                    setOpenModalMsj(true)
                } else {
                    setTitleModalMsj('Usuario no autorizado')
                    setErrorModal(true)
                    setOpenModalMsj(true)
                }
            } catch (error: any) {
                console.log('error:', error)
                setTitleModalMsj('Envio Fallido')
                setErrorModal(true)
                setMensajeModalMsj('' + error.message)
                setOpenModalMsj(true)
            }
        },
        [mutateEliminar, refetch]
    )

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                data?.ListaTipoIdentificacion ?? []
            )
            return new Fuse(
                data?.ListaTipoIdentificacion ?? [],
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataTipoID(result)
        } else {
            setDataTipoID(data?.ListaTipoIdentificacion ?? [])
        }
    }, [data?.ListaTipoIdentificacion, debounceSearch, fuse])

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

    const {
        getTableProps,
        getTableBodyProps,
        gotoPage,
        headerGroups,
        page,
        prepareRow,
        setPageSize,
        state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns: columnsTipoIdentificacion,
            data: dataTipoID,
            getRowId,
            onEdit,
            onDelete,
        },
        usePagination
    )

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Mantenimiento - Tipos de Identificaciones">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                {openModalMsj && (
                    <ModalAuth
                        openModal={openModalMsj}
                        // setOpenModal={setOpenModalMsj}
                        onClose={() => setOpenModalMsj(false)}
                        title={titleModalMsj}
                        message={mensajeModalMsj}
                        error={errorModal}
                    />
                )}
                <div
                    style={{ display: "flex", flexDirection: "column", width: "100%" }}
                    className={classes.container}
                >
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <Box className={classes.root} style={{
                            width: "90%",
                            maxWidth: "500px"
                        }}>
                            <div className={classes.title}>
                                <Typography variant="overline">
                                    Registro de Tipo de Identificación
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

                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>


                        <Box className={classes.root} style={{
                            width: "90%",
                            maxWidth: "500px"
                        }}>
                            <div className={classes.title}>
                                <Typography variant="overline">
                                    Listado de Tipos de Identificaciones
                                </Typography>
                            </div>
                            <div className={classes.contentButtons}>
                                <TextField
                                    // className={classes.textBox}
                                    variant="outlined"
                                    placeholder="Search"
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                    }}
                                    value={search}
                                />
                            </div>
                            <TableContainer>
                                <Table
                                    // className={classes.table}
                                    padding="normal"
                                    stickyHeader
                                    aria-label="sticky table"
                                    {...getTableProps()}
                                    id={'TableColor'}
                                >
                                    <TableHeader headerGroups={headerGroups} />
                                    <CardTableBody
                                        getTableBodyProps={getTableBodyProps}
                                        page={page}
                                        prepareRow={prepareRow}
                                    />
                                </Table>
                            </TableContainer>
                            <TablePaginations
                                lengthData={
                                    isNilOrEmpty(dataTipoID) ? 0 : dataTipoID.length
                                }
                                onChangePage={onChangePage}
                                onChangeRowsPerPage={onChangeRowsPerPage}
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                            />
                        </Box>
                    </div>
                </div>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoTipoIdentificacionIngresar
