import {
    colors,
    createStyles,
    makeStyles,
    Paper,
    Table,
    TableContainer,
    TextField,
} from '@material-ui/core'
import { isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import ModalAuth from '../../../components/core/input/dialog/modal-dialog'
import CardTableBody from '../../../components/table/table-body'
import TableHeader from '../../../components/table/table-header'
import TablePaginations from '../../../components/table/table-paginations'
import {
    isNotNilOrEmpty,
    isNilOrEmpty,
    isNotNil,
} from '../../../utils/is-nil-empty'
import Fuse from 'fuse.js'
import useDebounce from '../../../utils/useDebounce'
import { useRouter } from 'next/router'
import {
    IResultQueryTipoEdificacion,
    useDeleteTipoEdificacionMutation,
    useListaTipoEdificacionQuery,
} from '../../../components/mantenimento/tipo-edificacion/use-tipo-edificacion'
import { columnsTipoEdificacion } from '../../../components/mantenimento/tipo-edificacion/tipo-edificacion-dataTable'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            width: '50%',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        button: {
            marginTop: theme.spacing(1),
            color: 'white',
            margin: theme.spacing(1),
            height: '50%',
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            width: theme.spacing(2),
        },
        textBox: {
            backgroundColor: '',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // paddingTop: theme.spacing(6),
            // paddingBottom: theme.spacing(6),
        },
        selectFilter: {
            // padding: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 220,
            // textAlign: "center"
        },
        image: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(3),
        },
        contenFilter: {
            backgroundColor: colors.grey[50],
            marginBottom: theme.spacing(5),
            marginTop: theme.spacing(2),
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
        },
        contentForm: {
            marginTop: theme.spacing(3),
        },
    })
)

const extractData = (data: IResultQueryTipoEdificacion[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['tipo_edificacion'],
}

interface ITipoEdificacionNormalize {
    tipo_edificacion: string
}

const getRowId: any = prop('id')

const MantenimientoTipoEdificacionListado = () => {
    const classes = useStyles()
    const router = useRouter()
    const { data, loading, error } = useListaTipoEdificacionQuery()
    const [dataTipoEdificacion, setDataTipoEdificacion] = useState<
        ITipoEdificacionNormalize[]
    >([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    // const [boolPutColor, setBoolPutColor] = useState<boolean>(false)

    const [mutateEliminar] = useDeleteTipoEdificacionMutation()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataTipoEdificacion(extractData(data?.ListaTipoEdificacion!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(
        ({ id }: any) => {
            if (!isNil(id)) {
                router.push(
                    {
                        pathname:
                            '/mantenimiento/tipo-edificacion/registrar/[id]',
                    },
                    `/mantenimiento/tipo-edificacion/registrar/${encodeURIComponent(
                        id
                    )}`
                )
            }
        },
        [router]
    )

    const onDelete = useCallback(async ({ id }: any) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { message } = data.DeleteTipoEdificacion
                setTitleModalMsj(message)
                setErrorModal(false)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        gotoPage,
        headerGroups,
        page,
        prepareRow,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns: columnsTipoEdificacion,
            data: dataTipoEdificacion,
            getRowId,
            onEdit,
            onDelete,
        },
        usePagination
    )

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data?.ListaTipoEdificacion!)
            )
            return new Fuse(
                extractData(data?.ListaTipoEdificacion!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataTipoEdificacion(result)
        } else {
            setDataTipoEdificacion(extractData(data?.ListaTipoEdificacion!))
        }
    }, [data, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            //setOpenModal={setOpenModalMsj}

                            onClose={() => setOpenModalMsj(false)}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                            error={errorModal}
                        />
                    )}
                </>
                <Paper className={classes.root}>
                    <div className={classes.contentButtons}>
                        <TextField
                            className={classes.textBox}
                            variant="outlined"
                            placeholder="Buscar"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            value={search}
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
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
                            isNilOrEmpty(dataTipoEdificacion)
                                ? 0
                                : dataTipoEdificacion.length
                        }
                        onChangePage={onChangePage}
                        onChangeRowsPerPage={onChangeRowsPerPage}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                    />
                </Paper>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoTipoEdificacionListado
