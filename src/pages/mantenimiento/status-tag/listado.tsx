import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarStatusTagForm } from '../../../components/mantenimento/status-tag/status-tag-form'
import { useStylesMantenimientoListado } from '../../../utils/styles'
import {
    useListaStatusTagQuery,
    IResultQueryStatusTag,
    useDeleteStatusMutation,
} from '../../../components/mantenimento/status-tag/use-status-tag'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useDebounce from '../../../utils/useDebounce'
import {
    isNilOrEmpty,
    isNotNil,
    isNotNilOrEmpty,
} from '../../../utils/is-nil-empty'
import Fuse from 'fuse.js'
import { isNil, pluck, prop } from 'ramda'
import { usePagination, useTable } from 'react-table'
import { columnsStatusTag } from '../../../components/mantenimento/status-tag/status-tag-dataTable'
import {
    Paper,
    Table,
    TableContainer,
    TextField,
    Typography,
} from '@material-ui/core'
import TableHeader from '../../../components/table/table-header'
import CardTableBody from '../../../components/table/table-body'
import TablePaginations from '../../../components/table/table-paginations'
import router from 'next/router'
import ModalAuth from '../../../components/core/input/dialog/modal-dialog'

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['statusTag'],
}
const getRowId: any = prop('id')
const MantenimientoStatusTag = () => {
    const classes = useStylesMantenimientoListado()
    const { data, loading } = useListaStatusTagQuery()
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)
    const [dataStatusTag, setDataStatusTag] = useState<IResultQueryStatusTag[]>(
        []
    )

    const [mutateEliminar] = useDeleteStatusMutation()

    useEffect(() => {
        if (!loading && data && data.ListaStatusTag) {
            setDataStatusTag(data.ListaStatusTag)
        }
    }, [loading, data])

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data) && data?.ListaStatusTag) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                data.ListaStatusTag
            )
            return new Fuse(data.ListaStatusTag, optionsFuse, myIndex)
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataStatusTag(result)
        } else {
            setDataStatusTag(
                data && data.ListaStatusTag ? data.ListaStatusTag : []
            )
        }
    }, [data, debounceSearch, fuse])

    const onEdit = ({ id }: IResultQueryStatusTag) => {
        if (!isNil(id)) {
            router.push(
                `/mantenimiento/status-tag/registrar/${encodeURIComponent(id)}`
            )
        }
    }

    const onDelete = async ({ id }: IResultQueryStatusTag) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { code, message } = data.DeleteStatusTag
                setTitleModalMsj(message)
                if (code === 200) {
                    setErrorModal(false)
                } else {
                    setErrorModal(true)
                }

                setOpenModalMsj(true)
            } else {
                setTitleModalMsj('Usuario no autorizado')
                setErrorModal(true)
                setOpenModalMsj(true)
            }
        } catch (error: any) {
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setMensajeModalMsj('' + error.message)
            setOpenModalMsj(true)
        }
    }

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
            columns: columnsStatusTag,
            data: dataStatusTag,
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
        <LayoutTituloPagina titulo="Parametrización - Valores de los Tags">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}
            >
                {openModalMsj && (
                    <ModalAuth
                        openModal={openModalMsj}
                        onClose={() => setOpenModalMsj(false)}
                        // setOpenModal={setOpenModalMsj}
                        title={titleModalMsj}
                        message={mensajeModalMsj}
                        error={errorModal}
                    />
                )}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                    }}
                    className={classes.containerRoot}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <IngresarStatusTagForm />
                    </div>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Paper
                            className={classes.root}
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                            }}
                        >
                            <div className={classes.containerTitle}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    Listado de Status de Tags
                                </Typography>
                            </div>

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
                                    isNilOrEmpty(dataStatusTag)
                                        ? 0
                                        : dataStatusTag.length
                                }
                                onChangePage={onChangePage}
                                onChangeRowsPerPage={onChangeRowsPerPage}
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                            />
                        </Paper>
                    </div>
                </div>
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoStatusTag
