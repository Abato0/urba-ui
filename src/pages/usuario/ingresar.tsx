import {
    makeStyles,
    createStyles,
    colors,
    Paper,
    Table,
    TableContainer,
    TextField,
    Typography,
} from '@material-ui/core'
import AppLayout from '../../components/layout/app-layout'
import { FormIngresarUsuario } from '../../components/usuarios/form-ingresar-usuario'
import Fuse from 'fuse.js'
import { isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useDebounce from '../../utils/useDebounce'
import { useListadoUsuario } from '../../components/usuarios/use-usuario'
import {
    IResultUsuarioQuery,
    useDeleteUsuarioMutation,
} from '../../components/usuarios/use-usuario'
import {
    isNilOrEmpty,
    isNotNil,
    isNotNilOrEmpty,
} from '../../utils/is-nil-empty'
import { useTable, usePagination } from 'react-table'
import { columnsTags } from '../../components/tag/tag-dataTable'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import CardTableBody from '../../components/table/table-body'
import TableHeader from '../../components/table/table-header'
import TablePaginations from '../../components/table/table-paginations'
import { columnsUsuario } from '../../components/usuarios/usuario-dataTable'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'
import NavBar from '../../components/layout/app-bar'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'

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

        container: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        },
        containerRoot: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            margin: theme.spacing(2),
        },

        containerTitle: {
            // backgroundColor: "red",
            display: 'flex',
            justifyContent: 'center',
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1),
        },
        title: {
            fontSize: theme.typography.pxToRem(14),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            // fontWeight: "bold",
            // font
        },
    })
)

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['id', 'user'],
}

const getRowId = prop('id')

interface IUsuarioNormalize {
    tipo_usuario: string
    user: string
    nombre_completo: string
    email: string
    telefono: string
}

const extractData = (data: IResultUsuarioQuery[]): IUsuarioNormalize[] => {
    return data.map((usuario) => {
        return {
            id: usuario.id,
            tipo_usuario: usuario.tipo_usuario,
            user: usuario.user,
            email: usuario.email,
            nombre_completo: `${usuario.nombres} ${usuario.apellidos}`,
            telefono: usuario.telefono,
        }
    })
}

const IngresarUsuario = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const debounceSearch = useDebounce(search, 300)

    const [dataUsuario, setDataUsuario] = useState<IUsuarioNormalize[]>([])

    const [mutateEliminar] = useDeleteUsuarioMutation()
    const { data, loading, error, refetch } = useListadoUsuario()

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataUsuario(extractData(data?.ListaUsuario ?? []))
        }
    }, [data, loading, error])

    const onDelete = useCallback(async ({ id }: any) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { code, message } = data.DeleteUsuario
                setTitleModalMsj(message)
                setErrorModal(true)
                if (code === 200) {
                    setErrorModal(false)
                    await refetch()
                }
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
            columns: columnsUsuario,
            data: dataUsuario,
            getRowId,
            onDelete,
        },
        usePagination
    )

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data?.ListaUsuario ?? [])
            )
            return new Fuse(
                extractData(data?.ListaUsuario ?? []),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataUsuario(result)
        } else {
            setDataUsuario(extractData(data?.ListaUsuario ?? []))
        }
    }, [data?.ListaUsuario, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Usuario - Creación de usuario">
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
                        <FormIngresarUsuario />
                    </div>
                </div>
                <div style={{ flex: 1, width: '80%' }}>
                    <Paper className={classes.root}>
                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.title}
                            >
                                Listado de Usuarios
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
                                isNilOrEmpty(dataUsuario)
                                    ? 0
                                    : dataUsuario.length
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

export default IngresarUsuario
