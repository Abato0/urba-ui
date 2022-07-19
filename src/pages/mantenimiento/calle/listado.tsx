import {
    Paper,
    Table,
    TableContainer,
    TextField,
    Typography,
} from '@material-ui/core'
import { isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import ModalAuth from '../../../components/core/input/dialog/modal-dialog'
import AppLayout from '../../../components/layout/app-layout'
import TableHeader from '../../../components/table/table-header'
import TablePaginations from '../../../components/table/table-paginations'
import {
    isNotNilOrEmpty,
    isNilOrEmpty,
    isNotNil,
} from '../../../utils/is-nil-empty'
import Fuse from 'fuse.js'
import useDebounce from '../../../utils/useDebounce'
import {
    IResultQueryCalle,
    useDeleteCalleMutation,
    useListaCallesQuery,
} from '../../../components/mantenimento/calle/use-calle'
import { columnsCalle } from '../../../components/mantenimento/calle/calle-dataTable'
import { useRouter } from 'next/router'
import { IngresarCalleForm } from '../../../components/mantenimento/calle/calle-form'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'
import CardTableBody from '../../../components/table/table-body'

const extractData = (data: IResultQueryCalle[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['calle'],
}

interface IColorNormalize {
    calle: string
}

const getRowId: any = prop('id')

const MantenimientoCalleListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error } = useListaCallesQuery()
    const [dataColor, setColorData] = useState<IColorNormalize[]>([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [boolPutColor, setBoolPutColor] = useState<boolean>(false)

    const [mutateEliminar] = useDeleteCalleMutation()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setColorData(extractData(data?.ListaCalle!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(({ id }: any) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/mantenimiento/calle/registrar/[id]' },
                `/mantenimiento/calle/registrar/${encodeURIComponent(id)}`
            )
        }
    }, [])

    const onDelete = useCallback(async ({ id }: any) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { message } = data.DeleteCalle
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
    }, [])

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
            columns: columnsCalle,
            data: dataColor,
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
                extractData(data?.ListaCalle!)
            )
            return new Fuse(
                extractData(data?.ListaCalle!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setColorData(result)
        } else {
            setColorData(extractData(data?.ListaCalle!))
        }
    }, [data?.ListaCalle, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Parametrización - Calle">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            onClose={() => setOpenModalMsj(false)}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                            error={errorModal}
                        />
                    )}
                </>
                <div
                    style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}
                    className={classes.containerRoot}
                >
                    <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                        <IngresarCalleForm />
                    </div>

                    <Paper className={classes.root} style={{
                        width: "90%",
                        maxWidth: "500px"
                    }}>
                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.title}
                            >
                                Listado de Calles
                            </Typography>
                        </div>
                        <div className={classes.contentButtons}>
                            <TextField
                                className={classes.textBox}
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
                                isNilOrEmpty(dataColor) ? 0 : dataColor.length
                            }
                            onChangePage={onChangePage}
                            onChangeRowsPerPage={onChangeRowsPerPage}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                        />
                    </Paper>
                </div>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoCalleListado
