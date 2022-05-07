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
    IResultQueryParentesco,
    useDeleteParentescoMutation,
    useListaParentescoQuery,
} from '../../../components/mantenimento/parentesco/use-parentesco'
import { columnsParentesco } from '../../../components/mantenimento/parentesco/parentesco-dataTable'
import { IngresarParentescoForm } from '../../../components/mantenimento/parentesco/parentesco-form'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'

const extractData = (data: IResultQueryParentesco[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['parentesco'],
}

interface IParentescoNormalize {
    parentesco: string
}

const getRowId = prop('id')

const MantenimientoParentescoListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error } = useListaParentescoQuery()
    const [dataParentesco, setDataParentesco] = useState<
        IParentescoNormalize[]
    >([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [mutateEliminar] = useDeleteParentescoMutation()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataParentesco(extractData(data?.ListaParentesco!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(
        ({ id }: any) => {
            if (!isNil(id)) {
                router.push(
                    { pathname: '/mantenimiento/parentesco/registrar/[id]' },
                    `/mantenimiento/parentesco/registrar/${encodeURIComponent(
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
                    const { message } = data.DeleteParentesco
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
        },
        [mutateEliminar]
    )

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
            columns: columnsParentesco,
            data: dataParentesco,
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
                extractData(data?.ListaParentesco!)
            )
            return new Fuse(
                extractData(data?.ListaParentesco!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataParentesco(result)
        } else {
            setDataParentesco(extractData(data?.ListaParentesco!))
        }
    }, [data?.ListaParentesco, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Mantenimiento - Parentesco">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            setOpenModal={setOpenModalMsj}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                            error={errorModal}
                        />
                    )}
                </>
                <div
                    style={{ justifyContent: 'space-around' }}
                    className={classes.containerRoot}
                >
                    <div>
                        <IngresarParentescoForm />
                    </div>
                    <Paper className={classes.root}>
                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.title}
                            >
                                Listado de Parentescos
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
                                isNilOrEmpty(dataParentesco)
                                    ? 0
                                    : dataParentesco.length
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

export default MantenimientoParentescoListado
