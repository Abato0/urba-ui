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
import { useDeleteMarcaMutation } from '../../../components/mantenimento/marca/use-marca'
import {
    IResultQueryModelo,
    useListaModeloQuery,
} from '../../../components/mantenimento/modelo/use-modelo'
import { columnsModelo } from '../../../components/mantenimento/modelo/modelo-dataTable'
import { IngresarModeloForm } from '../../../components/mantenimento/modelo/modelo-form'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'

const extractData = (data: IResultQueryModelo[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['modelo'],
}

interface IModeloNormalize {
    modelo: string
}

const getRowId = prop('id')

const MantenimientoModeloListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error } = useListaModeloQuery()
    const [dataMarca, setColorMarca] = useState<IModeloNormalize[]>([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [mutateEliminar] = useDeleteMarcaMutation()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setColorMarca(extractData(data?.ListaModelo!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(({ id }: any) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/mantenimiento/modelo/registrar/[id]' },
                `/mantenimiento/modelo/registrar/${encodeURIComponent(id)}`
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
                const { message } = data.DeleteMarca
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
            columns: columnsModelo,
            data: dataMarca,
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
                extractData(data?.ListaModelo!)
            )
            return new Fuse(
                extractData(data?.ListaModelo!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setColorMarca(result)
        } else {
            setColorMarca(extractData(data?.ListaModelo!))
        }
    }, [data?.ListaModelo, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Mantenimiento - Modelos de Vehiculos">
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
                        <IngresarModeloForm />
                    </div>

                    <Paper className={classes.root}>
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
                                isNilOrEmpty(dataMarca) ? 0 : dataMarca.length
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

export default MantenimientoModeloListado
