import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import {
    IVisitanteVariables,
    useDeleteVisitanteMutation,
    useListadoVisitanteQuery,
    useSalidaVisitanteMution,
} from '../../components/visitante/use-visitante'
import useDebounce from '../../utils/useDebounce'
import Fuse from 'fuse.js'
import {
    makeStyles,
    createStyles,
    colors,
    Paper,
    Table,
    TableContainer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core'
import { isEmpty, isNil, prop } from 'ramda'
import { lightFormat } from 'date-fns'
import { direccionGrupoFamiliar } from '../../utils/parseDate'
import { usePagination, useTable } from 'react-table'
import { columnsVisitante } from '../../components/visitante/visitante-data-table'
import CardTableBody from '../../components/table/table-body'
import TableHeader from '../../components/table/table-header'
import TablePaginations from '../../components/table/table-paginations'
import { isNotNil, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import { useListarGrupoFamiliar } from '../../components/grupo-familiar/use-grupo-familia'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: '12px',
            margin: '30px',
            // maxWidth: "800px",
            width: '85%',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignContent: "center",
            alignItems: 'center',
            width: '100%',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        button: {
            marginTop: theme.spacing(1),
            color: 'white',
            margin: theme.spacing(1),
            // height: "50%",
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            minWidth: theme.spacing(14),
            // height: theme.spacing(12),
            padding: theme.spacing(3),
            maxHeight: theme.spacing(1),
        },
        textBox: {
            backgroundColor: '',
            width: theme.spacing(40),
            marginTop: theme.spacing(2),
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
        formControl: {
            margin: theme.spacing(1),
            minWidth: 220,
            // textAlign: "center"
        },
        labelButton: {
            fontSize: theme.typography.pxToRem(11),
            fontFamily: 'Roboto',
        },

        containerTitle: {
            // backgroundColor: "red",
            display: 'flex',
            justifyContent: 'center',
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1),
        },
        title: {
            fontSize: theme.typography.pxToRem(19),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            // fontWeight: "bold",
            // font
        },
        paperFilter: {
            width: '85%',
            borderRadius: 8,
        },
    })
)
const getRowId: any = prop('id')

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['nombre_visitante'],
}

export interface IVisianteNormalize {
    nombre_visitante: string
    descripcion: string
    fecha_visita: string
    fecha_llegada: string
    fecha_salida: string
    identificacion_visitante: string
    placa_vehiculo: string
    nombre_grupo_familiar: string
    direccion: string
    id: number
}

const extractData = (data: IVisitanteVariables[]): IVisianteNormalize[] => {
    return data.map((item) => {
        return {
            id: item.id!,
            descripcion: item.descripcion,
            nombre_visitante: item.nombre_visitante,
            fecha_visita: item.fecha_visita
                ? lightFormat(Number(item.fecha_visita), 'yyyy-MM-dd')
                : '',
            nombre_grupo_familiar: item.grupoFamiliar.nombre_familiar,
            direccion: direccionGrupoFamiliar(item.grupoFamiliar),
            fecha_llegada: item.fecha_llegada
                ? lightFormat(Number(item.fecha_llegada), 'yyyy-MM-dd HH:mm')
                : '',
            identificacion_visitante: item.identificacion_visitante || '',
            placa_vehiculo: item.placa_vehiculo || '',
            fecha_salida: item.fecha_salida
                ? lightFormat(Number(item.fecha_salida), 'yyyy-MM-dd HH:mm')
                : '',
        }
    })
}

const ListadoMoradorVisiante = () => {
    const classes = useStyles()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const debounceSearch = useDebounce(search, 300)
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const { data, loading } = useListadoVisitanteQuery()
    const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
        number | undefined
    >()

    const {
        data: dataListadoGrupoFamiliar,
        loading: loadingListadoGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const [mutateSalida] = useSalidaVisitanteMution()
    const [mutateEliminar] = useDeleteVisitanteMutation()

    const [dataVisitante, setDataVisitante] = useState<IVisianteNormalize[]>([])

    const onEdit = useCallback(({ id }: IVisianteNormalize) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/visitantes/ingresar-entrada/[id]' },
                `/visitantes/ingresar-entrada/${encodeURIComponent(id)}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDelete = useCallback(async ({ id }: IVisianteNormalize) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { message } = data.DeleteVisitante
                setTitleModalMsj(message)
                setErrorModal(false)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSalida = useCallback(async ({ id }: IVisianteNormalize) => {
        try {
            const { data } = await mutateSalida({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { message } = data.SalidaVisitante
                setTitleModalMsj(message)
                setErrorModal(false)
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
        state: {
            pageIndex,
            pageSize,
            // , selectedRowIds
        },
    } = useTable(
        {
            columns: columnsVisitante,
            data: dataVisitante,
            getRowId,
            onEdit,
            onSalida,
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

    useEffect(() => {
        if (!loading && data && data.ListadoVisitante) {
            const result: IVisianteNormalize[] = extractData(
                data.ListadoVisitante
            )
            setDataVisitante(result)
            // setDataVisitante(data.ListadoVisitante)
        }
    }, [data, loading])

    const filtrar = () => {
        if (idGrupoFamiliarFilter && data && data.ListadoVisitante) {
            const result = data.ListadoVisitante.filter(
                ({ grupoFamiliar }) =>
                    grupoFamiliar.id === idGrupoFamiliarFilter
            )
            setDataVisitante(extractData(result))
        }
    }

    const reset = () => {
        if (!loading && data && data.ListadoVisitante) {
            const result: IVisianteNormalize[] = extractData(
                data.ListadoVisitante
            )
            setDataVisitante(result)
            // setDataVisitante(data.ListadoVisitante)
        }
        setIdGrupoFamiliarFilter(undefined)
    }

    return (
        <LayoutTituloPagina titulo="Listado - Visitante">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.SEGURIDAD]}
            >
                {openModalMsj && (
                    <ModalAuth
                        openModal={openModalMsj}
                        onClose={() => setOpenModalMsj(false)}
                        //  setOpenModal={setOpenModalMsj}
                        title={titleModalMsj}
                        message={mensajeModalMsj}
                        error={errorModal}
                    />
                )}
                <Paper className={classes.paperFilter}>
                    <div className={classes.contenFilter}>
                        <div className={classes.contentButtons}>
                            <div className={classes.contentForm}>
                                <FormControl
                                    variant="filled"
                                    className={classes.formControl}
                                >
                                    <InputLabel id="idGrupoFamiliar_label">
                                        Grupo Familiar
                                    </InputLabel>
                                    <Select
                                        //    className={classes.selectFilter}
                                        labelId="idGrupoFamiliar_label"
                                        value={idGrupoFamiliarFilter}
                                        onChange={(e) =>
                                            setIdGrupoFamiliarFilter(
                                                e.target.value as number
                                            )
                                        }
                                    >
                                        {/* <MenuItem
                                        style={{
                                            textTransform: 'uppercase',
                                        }}
                                        value={undefined}
                                    >
                                        {' '}
                                        - Todos -{' '}
                                    </MenuItem> */}
                                        {!loadingListadoGrupoFamiliar &&
                                            isNotNilOrEmpty(
                                                dataListadoGrupoFamiliar
                                            ) &&
                                            dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                                                (
                                                    {
                                                        id,
                                                        nombre_familiar,
                                                        manzana,
                                                        extension,
                                                        villa,
                                                    },
                                                    index
                                                ) => {
                                                    return (
                                                        <MenuItem
                                                            key={index}
                                                            value={id}
                                                            style={{
                                                                textTransform:
                                                                    'uppercase',
                                                            }}
                                                        >
                                                            {`${nombre_familiar}-${
                                                                manzana.manzana
                                                            }${
                                                                extension &&
                                                                !isEmpty(
                                                                    extension
                                                                )
                                                                    ? `-${villa}-${extension}`
                                                                    : ''
                                                            } `}
                                                        </MenuItem>
                                                    )
                                                }
                                            )}
                                    </Select>
                                </FormControl>
                            </div>
                            <ActionsButtonsFilterReset
                                filtrar={filtrar}
                                reset={reset}
                            />
                        </div>
                    </div>
                </Paper>

                <Paper className={classes.root}>
                    <div className={classes.contentButtons}>
                        <TextField
                            className={classes.textBox}
                            variant="outlined"
                            placeholder={'Buscar'}
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            value={search}
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />
                        {/* <ActionsButtonsExcelPdf
                        ExportExcel={ExportExcel}
                        columnsPdf={columnsPdf}
                        idTable={idTable}
                        orientacion={orientacion}
                        titlePdf={titlePdf}
                    /> */}
                    </div>
                    <TableContainer>
                        <Table
                            // className={classes.table}
                            stickyHeader
                            aria-label="sticky table"
                            {...getTableProps()}
                            id={'idTable'}
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
                        lengthData={dataVisitante.length}
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

export default ListadoMoradorVisiante
