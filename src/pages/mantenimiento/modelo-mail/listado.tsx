import { Paper, Table, TableContainer, TextField } from '@material-ui/core'
import { useRouter } from 'next/router'
import { prop, isNil, pluck } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTable, usePagination } from 'react-table'
import { columnsModeloMail } from '../../../components/mantenimento/modelo-mail/modelo-mail-dataTable'
import {
    useListaModeloMailQuery,
    IResultQueryModeloMail,
} from '../../../components/mantenimento/modelo-mail/use-modelo-mail'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import useDebounce from '../../../utils/useDebounce'
import Fuse from 'fuse.js'
import ModalAuth from '../../../components/core/input/dialog/modal-dialog'
import CardTableBody from '../../../components/table/table-body'
import TableHeader from '../../../components/table/table-header'
import TablePaginations from '../../../components/table/table-paginations'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['categoria'],
}
const getRowId = prop('id')

const MantenimientoModeloMailListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error, refetch } = useListaModeloMailQuery()
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [dataModeloMail, setDataModeloMail] = useState<
        IResultQueryModeloMail[]
    >([])

    useEffect(() => {
        if (!loading && data && isNotNilOrEmpty(data.ListaModeloMail)) {
            setDataModeloMail(data.ListaModeloMail!)
        }
    }, [data, loading, error])

    const onEdit = useCallback(
        ({ id }: any) => {
            try {
                if (!isNil(id)) {
                    router.push(
                        { pathname: '/mantenimiento/modelo-mail/[id]' },
                        `/mantenimiento/modelo-mail/${encodeURIComponent(id)}`
                    )
                }
            } catch (error) {
                console.log('error: ', error)
                setMensajeModalMsj((error as Error).message)
            }
        },
        [router]
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
            columns: columnsModeloMail,
            data: dataModeloMail,
            getRowId,
            onEdit,
        },
        usePagination
    )

    const fuse = useMemo(() => {
        if (data && isNotNilOrEmpty(data.ListaModeloMail)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                data.ListaModeloMail!
            )
            return new Fuse(data.ListaModeloMail!, optionsFuse, myIndex)
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataModeloMail(result)
        } else {
            setDataModeloMail(data?.ListaModeloMail ?? [])
        }
    }, [data?.ListaModeloMail, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Mantenimiento - Listado de Modelos de Correos">
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

                <Paper className={classes.root}>
                    {/* <div className={classes.containerTitle}>
            <Typography variant="overline" className={classes.title}>
              Modelos de correos
            </Typography>
          </div> */}
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
                            isNilOrEmpty(dataModeloMail)
                                ? 0
                                : dataModeloMail.length
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

export default MantenimientoModeloMailListado
