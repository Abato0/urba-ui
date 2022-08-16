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
    IResultQueryValorTag,
    useDeleteValorTag,
    useListadoValorTag,
} from '../../../components/mantenimento/valor-tag/use-valor-tag'
import { columnsValorTag } from '../../../components/mantenimento/valor-tag/valor-tag-dataTable'
import { IngresarValorTagForm } from '../../../components/mantenimento/valor-tag/valor-tag-form'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'

const extractData = (data: IResultQueryValorTag[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['tipo_tag', 'valor'],
}

interface IValorTagNormalize {
    tipo_tag: string
    valor: number
}

const getRowId: any = prop('id')

const MantenimientoParentescoListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error, refetch } = useListadoValorTag()
    const [dataValorTag, setDataValorTag] = useState<IValorTagNormalize[]>([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [mutateEliminar] = useDeleteValorTag()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataValorTag(extractData(data?.ListaValorTag!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(
        ({ id }: any) => {
            if (!isNil(id)) {
                router.push(
                    { pathname: '/mantenimiento/valor-tag/registrar/[id]' },
                    `/mantenimiento/valor-tag/registrar/${encodeURIComponent(
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
                const { code, message } = data.DeleteValorTag
                setTitleModalMsj(message)
                setErrorModal(false)
                setOpenModalMsj(true)
                if (code === 200) refetch()
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
            columns: columnsValorTag,
            data: dataValorTag,
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
                extractData(data?.ListaValorTag!)
            )
            return new Fuse(
                extractData(data?.ListaValorTag!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataValorTag(result)
        } else {
            setDataValorTag(extractData(data?.ListaValorTag!))
        }
    }, [data?.ListaValorTag, debounceSearch, fuse])

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
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <>
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
                </>
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
                        <IngresarValorTagForm />
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
                                    Listado de Valores de Tag
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
                                    isNilOrEmpty(dataValorTag)
                                        ? 0
                                        : dataValorTag.length
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

export default MantenimientoParentescoListado
