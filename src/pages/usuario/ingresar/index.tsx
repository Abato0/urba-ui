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
import { FormIngresarUsuario } from '../../../components/usuarios/form-ingresar-usuario'
import Fuse from 'fuse.js'
import { isEmpty, isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useDebounce from '../../../utils/useDebounce'
import {
    useListadoUsuario,
    useListadoUsuarioSinFamilares,
} from '../../../components/usuarios/use-usuario'
import {
    IResultUsuarioQuery,
    useDeleteUsuarioMutation,
} from '../../../components/usuarios/use-usuario'
import {
    isNilOrEmpty,
    isNotNil,
    isNotNilOrEmpty,
} from '../../../utils/is-nil-empty'
import { useTable, usePagination } from 'react-table'
import ModalAuth from '../../../components/core/input/dialog/modal-dialog'
import CardTableBody from '../../../components/table/table-body'
import TableHeader from '../../../components/table/table-header'
import TablePaginations from '../../../components/table/table-paginations'
import { columnsUsuario } from '../../../components/usuarios/usuario-dataTable'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import ModalVinculacionUsuario from '../../../components/usuarios/modalVinculacion'
import { useRouter } from 'next/router'
import { ModalConfirmacion } from '../../../components/core/modal/modalConfirmacion'
import { recordarContrasena } from '../../../auth/auth-service'

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
            // minWidth: 220,
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
            width: '80%',
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

const getRowId: any = prop('id')

export interface IUsuarioNormalize {
    tipo_usuario: string
    user: string
    nombre_completo: string
    email: string
    telefono: string
    num_identificacion: string
}

const extractData = (data: IResultUsuarioQuery[]): IUsuarioNormalize[] => {
    return data
        .map((usuario) => {
            return {
                id: usuario.id,
                tipo_usuario: usuario.tipo_usuario,
                user: usuario.user,
                email: usuario.email,
                nombre_completo: `${usuario.nombres} ${usuario.apellidos}`,
                telefono: usuario.telefono,
                num_identificacion: usuario.num_identificacion,
                grupoFamiliar: usuario.grupoFamiliar || '',
            }
        })
        .sort((a, b) => (a.nombre_completo < b.nombre_completo ? -1 : 1))
}

const IngresarUsuario = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const debounceSearch = useDebounce(search, 300)
    const router = useRouter()

    const { data: dataListarGrupo, loading: loadingListarGrupo } =
        useListadoUsuarioSinFamilares()

    const listadoSinUsuarios = useMemo(() => {
        if (!loadingListarGrupo && dataListarGrupo) {
            return dataListarGrupo.ListaUsuarioSinGrupoFamiliar || []
        }
        return []
    }, [dataListarGrupo, loadingListarGrupo])

    const [openModalVincular, setOpenModalVincular] = useState(false)
    const [idUsuarioVincular, setIdUsuarioVincular] = useState<number>()

    const [numIdenUsuarioPassword, setNumIdenUsuarioPassword] =
        useState<string>('')

    const [dataUsuario, setDataUsuario] = useState<IUsuarioNormalize[]>([])

    const [mutateEliminar] = useDeleteUsuarioMutation()
    const { data, loading, error, refetch } = useListadoUsuario()

    const [openModalPermiso, setOpenModalPermiso] = useState(false)
    const [titlePermiso, setTitlePermiso] = useState('')

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataUsuario(extractData(data?.ListaUsuario ?? []))
        }
    }, [data, loading, error])

    const onVerificar = ({ id }: IResultUsuarioQuery) => {
        return listadoSinUsuarios.some((usuario) => usuario.id === id)
        // return false
    }

    const onVincular = ({ id }: IResultUsuarioQuery) => {
        setIdUsuarioVincular(id)
        setOpenModalVincular(true)
    }

    const onEditar = ({ id }: IResultUsuarioQuery) => {
        router.push({
            pathname: '/usuario/ingresar/' + id,
        })
    }

    const onChangePassword = ({
        email,
        num_identificacion,
    }: IResultUsuarioQuery) => {
        setTitlePermiso(
            `La nueva contraseña, se enviara por correo a la direccion de correo ${email}. ¿Está seguro de reestablecer la contraseña?. ${num_identificacion}`
        )
        setNumIdenUsuarioPassword(num_identificacion)
        setOpenModalPermiso(true)
    }

    const cambiarContraseña = async () => {
        try {
            if (numIdenUsuarioPassword && !isEmpty(numIdenUsuarioPassword)) {
                const data = await recordarContrasena(numIdenUsuarioPassword)
                if (data) {
                    setOpenModalPermiso(false)
                    const { code, message } = data
                    setTitleModalMsj(message)
                    setErrorModal(true)
                    if (code === 200) {
                        setErrorModal(false)
                    }
                    setOpenModalMsj(true)
                } else {
                    setOpenModalPermiso(false)
                    setOpenModalMsj(true)
                    setErrorModal(false)
                    setTitleModalMsj('Contraseña no ha sido cambiada')
                }
            }
        } catch (error) {
            setTitleModalMsj('Envio Fallido')
            setErrorModal(true)
            setMensajeModalMsj((error as Error).message)
            setOpenModalMsj(true)
        }
    }

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
                    // await refetch()
                }
                setOpenModalMsj(true)
            } else {
                setTitleModalMsj('Usuario no autorizado')
                setErrorModal(true)
                setOpenModalMsj(true)
            }
        } catch (error: any) {
            console.log('error:', error)
            setTitleModalMsj('Envio Fallido: ' + (error as Error).message)
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
            columns: columnsUsuario,
            data: dataUsuario,
            getRowId,
            onDelete,
            onVincular,
            onEditar,
            onVerificar,
            onChangePassword,
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
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    return (
        <LayoutTituloPagina titulo="Usuario - Creación de usuario">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <>
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

                    {openModalVincular && idUsuarioVincular && (
                        <ModalVinculacionUsuario
                            idUsuario={idUsuarioVincular}
                            open={openModalVincular}
                            onClose={() => setOpenModalVincular(false)}
                        />
                    )}
                    {openModalPermiso && (
                        <ModalConfirmacion
                            mensaje={titlePermiso}
                            openModal={openModalPermiso}
                            onCancel={() => setOpenModalPermiso(false)}
                            onConfirm={() => cambiarContraseña()}
                        />
                    )}
                </>
                <div
                    style={{ justifyContent: 'space-around' }}
                    className={classes.containerRoot}
                >
                    {/* <div> */}
                    <FormIngresarUsuario />
                    {/* </div> */}
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
