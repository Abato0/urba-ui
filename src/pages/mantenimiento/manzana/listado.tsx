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
    IResultQueryManzana,
    useDeleteManzanaMutation,
    useListaManzanaQuery,
} from '../../../components/mantenimento/manzana/use-manzana'
import { columnsManzana } from '../../../components/mantenimento/manzana/manzana.dataTable'
import { IngresarManzanaForm } from '../../../components/mantenimento/manzana/manzana-form'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { useStylesMantenimientoListado } from '../../../utils/styles'

// const useStyles = makeStyles((theme) =>
//     createStyles({
//         root: {
//             // marginTop: theme.spacing(2),
//             // marginBottom: theme.spacing(2),
//             borderRadius: '12px',
//             width: '50%',
//             margin: theme.spacing(2),
//         },
//         contentButtons: {
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             width: '100%',
//             padding: theme.spacing(2),
//             marginTop: theme.spacing(2),
//         },
//         button: {
//             marginTop: theme.spacing(1),
//             color: 'white',
//             margin: theme.spacing(1),
//             height: '50%',
//             backgroundColor: colors.blueGrey[900],
//             '&:hover': {
//                 backgroundColor: colors.blueGrey[800],
//             },
//             width: theme.spacing(2),
//         },
//         textBox: {
//             backgroundColor: '',
//         },
//         container: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//         },
//         row: {
//             display: 'flex',
//             flexDirection: 'row',
//             alignItems: 'center',
//             // paddingTop: theme.spacing(6),
//             // paddingBottom: theme.spacing(6),
//         },
//         selectFilter: {
//             // padding: theme.spacing(2),
//         },
//         formControl: {
//             margin: theme.spacing(1),
//             minWidth: 220,
//             // textAlign: "center"
//         },
//         image: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             paddingTop: theme.spacing(3),
//         },
//         contenFilter: {
//             backgroundColor: colors.grey[50],
//             marginBottom: theme.spacing(5),
//             marginTop: theme.spacing(2),
//             // display: "flex",
//             // alignItems: "center",
//             // justifyContent: "center",
//         },
//         contentForm: {
//             marginTop: theme.spacing(3),
//         },

//         containerRoot: {
//             display: 'flex',
//             flexDirection: 'row',
//             width: '100%',
//             margin: theme.spacing(2),
//         },

//         containerTitle: {
//             // backgroundColor: "red",
//             display: 'flex',
//             justifyContent: 'center',
//             marginTop: theme.spacing(3),
//             marginBottom: theme.spacing(1),
//         },
//         title: {
//             fontSize: theme.typography.pxToRem(14),
//             backgroundColor: colors.grey[200],
//             paddingTop: theme.spacing(1),
//             paddingBottom: theme.spacing(1),
//             paddingLeft: theme.spacing(4),
//             paddingRight: theme.spacing(4),
//             borderRadius: 5,
//             // fontWeight: "bold",
//             // font
//         },
//     })
// )

const extractData = (data: IResultQueryManzana[]) => {
    return isNotNilOrEmpty(data) ? data : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['manzana'],
}

interface IManzanaNormalize {
    manzana: string
}

const getRowId: any = prop('id')

const MantenimientoManzanaListado = () => {
    const classes = useStylesMantenimientoListado()
    const router = useRouter()
    const { data, loading, error } = useListaManzanaQuery()
    const [dataManzana, setColorManzana] = useState<IManzanaNormalize[]>([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const debounceSearch = useDebounce(search, 300)

    const [mutateEliminar] = useDeleteManzanaMutation()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setColorManzana(extractData(data?.ListaManzana!))
        }
    }, [data, loading, error])

    const onEdit = useCallback(({ id }: any) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/mantenimiento/manzana/registrar/[id]' },
                `/mantenimiento/manzana/registrar/${encodeURIComponent(id)}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDelete = useCallback(async ({ id }: any) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { message } = data.DeleteManzana
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
            columns: columnsManzana,
            data: dataManzana,
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
                extractData(data?.ListaManzana!)
            )
            return new Fuse(
                extractData(data?.ListaManzana!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setColorManzana(result)
        } else {
            setColorManzana(extractData(data?.ListaManzana!))
        }
    }, [data?.ListaManzana, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Parametrización - Manzanas">
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
                        <IngresarManzanaForm />
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
                                width: '90%',
                                maxWidth: '500px',
                            }}
                        >
                            <div className={classes.containerTitle}>
                                <Typography
                                    variant="overline"
                                    className={classes.title}
                                >
                                    Listado de Manzanas
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
                                    isNilOrEmpty(dataManzana)
                                        ? 0
                                        : dataManzana.length
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

export default MantenimientoManzanaListado
