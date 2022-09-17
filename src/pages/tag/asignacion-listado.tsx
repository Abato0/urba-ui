import {
    colors,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableContainer,
    TextField,
} from '@material-ui/core'
import { isEmpty, isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import {
    IResultQueryTagVehiculo,
    useDeleteTagVehiculoMutation,
    useListaTagVehiculo,
} from '../../components/tag/use-tag'
import {
    isNilOrEmpty,
    isNotNil,
    isNotNilOrEmpty,
} from '../../utils/is-nil-empty'
import Fuse from 'fuse.js'
import { columnsTagVehiculo } from '../../components/tag/tag-dataTable'
import useDebounce from '../../utils/useDebounce'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import CardTableBody from '../../components/table/table-body'
import TableHeader from '../../components/table/table-header'
import TablePaginations from '../../components/table/table-paginations'
import { useListarGrupoFamiliar } from '../../components/grupo-familiar/use-grupo-familia'
import { TipoUsuario } from '../../components/core/input/dateSelect'
import PermisoLayout from '../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'
import { ActionsButtonsExcelPdf } from '../../components/core/actions/actionsButtonsExcelPdf'
import XLSX from 'xlsx'
import { getFormatoGrupoFamiliar } from '../../utils/keys'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            width: '85%',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
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
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // paddingTop: theme.spacing(6),
            // paddingBottom: theme.spacing(6),
        },
        selectFilter: {
            // padding: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 220,
            // textAlign: "center"
        },
        image: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: theme.spacing(3),
        },
        contenFilter: {
            // backgroundColor: colors.grey[50],
            marginBottom: theme.spacing(5),
            marginTop: theme.spacing(2),
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: "space-between",
        },
        contentForm: {
            marginTop: theme.spacing(3),
            display: 'flex',
            //   flexDirection: "column",

            width: '100%',
            height: '100%',
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
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
        labelButton: {
            fontSize: theme.typography.pxToRem(11),
            fontFamily: 'Roboto',
        },
        paperFilter: {
            width: '85%',
            borderRadius: 8,
        },
    })
)

interface ITagsVariablesNormalize {
    id: number
    idGrupoFamiliar: number
    nombre_familiar: string
    modelo: string
    marca: string
    color: string
    placa: string
    code: string
    ultimoPago: string
    // tipo_tag: string;
    // monto: number;
    // fecha_pago: string;
}

const extractData = (
    data: IResultQueryTagVehiculo[]
): ITagsVariablesNormalize[] => {
    return isNotNilOrEmpty(data)
        ? data.map(({ id, vehiculo, tag, ultimoPago }) => {
              return {
                  id,
                  idGrupoFamiliar: vehiculo.grupoFamiliar.id!,
                  //  nombre_familiar: `${vehiculo.grupoFamiliar.nombre_familiar} - ${vehiculo.grupoFamiliar.manzana.manzana} - ${vehiculo.grupoFamiliar.villa}`,
                  nombre_familiar: getFormatoGrupoFamiliar(
                      vehiculo.grupoFamiliar
                  ),
                  placa: vehiculo.placa,
                  code: tag.code,
                  color: vehiculo.color.color ?? '',
                  marca: vehiculo.marca.marca ?? '',
                  modelo: vehiculo.modelo.modelo ?? '',
                  ultimoPago: ultimoPago || '',
              }
          })
        : []
}

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['nombre_familiar', 'placa'],
}

const getRowId: any = prop('id')

const MantenimientoParentescoListado = () => {
    const classes = useStyles()
    //   const router = useRouter();
    const { data, loading, error } = useListaTagVehiculo()
    const [dataTag, setDataTag] = useState<ITagsVariablesNormalize[]>([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const [boolPut, setBoolPut] = useState<boolean>(false)

    const [mutateEliminar] = useDeleteTagVehiculoMutation()
    const debounceSearch = useDebounce(search, 300)
    const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
        number | undefined
    >()

    const {
        data: dataListadoGrupoFamiliar,
        loading: loadingListadoGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const onCloseModal = async () => {
        if (openModalMsj && boolPut) {
            // await refetch()
            setOpenModalMsj(false)
            // console.log("1")
        } else {
            setOpenModalMsj(false)
            //console.log("2", " * ", openModalMsj && boolPut)
        }
    }

    const onDelete = async ({ id }: IResultQueryTagVehiculo) => {
        try {
            const { data } = await mutateEliminar({
                variables: {
                    id,
                },
            })
            if (isNotNil(data)) {
                const { code, message } = data.DeleteTagPagoVehiculo
                setTitleModalMsj(message)
                if (code === 200) {
                    setBoolPut(true)
                    setErrorModal(false)
                } else {
                    setErrorModal(true)
                }
                setOpenModalMsj(true)
                return
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

    // const {
    //   data: dataValorTag,
    //   loading: loadingValorTag,
    //   error: errorValorTag,
    // } = useListadoValorTag();

    useEffect(() => {
        if (isNotNilOrEmpty(data) && !loading) {
            setDataTag(extractData(data?.ListaTagVehiculo!))
        }
    }, [data, loading, error])

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
            columns: columnsTagVehiculo,
            data: dataTag,
            getRowId,
            //   onEdit,
            onDelete,
        },
        usePagination
    )

    const fuse = useMemo(() => {
        if (isNotNilOrEmpty(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data?.ListaTagVehiculo!)
            )
            return new Fuse(
                extractData(data?.ListaTagVehiculo!),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataTag(result)
        } else {
            setDataTag(extractData(data?.ListaTagVehiculo!))
        }
    }, [data?.ListaTagVehiculo, debounceSearch, fuse])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    const filtrar = useCallback(() => {
        if (
            idGrupoFamiliarFilter &&
            // idValorTagFilter &&
            data &&
            data.ListaTagVehiculo
        ) {
            const result = data.ListaTagVehiculo.filter(
                ({ vehiculo }) =>
                    vehiculo.grupoFamiliar.id === idGrupoFamiliarFilter
            )
            setDataTag(extractData(result))
        }
    }, [idGrupoFamiliarFilter, data])
    //   }, [idGrupoFamiliarFilter, data,setDataTag]);

    const reset = useCallback(() => {
        if (!loading && data) {
            setDataTag(extractData(data?.ListaTagVehiculo!))
        }
    }, [loading, data])

    const ExportExcel = () => {
        if (isNotNilOrEmpty(dataTag)) {
            const newCampos = dataTag.map(
                ({
                    nombre_familiar,
                    code,
                    color,
                    marca,
                    modelo,
                    placa,
                    ultimoPago,
                }) => {
                    return {
                        GrupoFamiliar: nombre_familiar,
                        TAG: code,
                        Placa: placa,
                        Marca: marca,
                        Modelo: modelo,
                        Color: color,
                        UltimoPago: ultimoPago,
                    }
                }
            )
            const workSheet = XLSX.utils.json_to_sheet(newCampos)

            // workSheet.A1.v = 'Grupo familiar'
            // workSheet.B1.v = 'Tipo de pago'
            // workSheet.C1.v = 'Referencia'
            // workSheet.D1.v = 'FECHA DEL REGISTRO DEL PAGO'
            // workSheet.E1.v = 'FECHA DEL PAGO REALIZADO'

            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, 'Aportaciones')
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Listado de Asignación de Tags.xlsx')
        }
    }

    return (
        <LayoutTituloPagina titulo="Tags - Listado de Asignación de TAGs">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}
            >
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            onClose={() => onCloseModal()}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                            error={errorModal}
                        />
                    )}
                </>
                <Paper className={classes.paperFilter}>
                    <div className={classes.contenFilter}>
                        <div
                            style={{ justifyContent: 'space-between' }}
                            className={classes.contentForm}
                        >
                            <div>
                                <FormControl
                                    variant="filled"
                                    className={classes.formControl}
                                >
                                    <InputLabel id="idGrupoFamiliar_label">
                                        Grupo Familiar
                                    </InputLabel>
                                    <Select
                                        className={classes.selectFilter}
                                        labelId="idGrupoFamiliar_label"
                                        value={idGrupoFamiliarFilter}
                                        onChange={(e) =>
                                            setIdGrupoFamiliarFilter(
                                                e.target.value as number
                                            )
                                        }
                                    >
                                        <MenuItem value={undefined}>
                                            {' '}
                                            - Todos -{' '}
                                        </MenuItem>
                                        {!loadingListadoGrupoFamiliar &&
                                            isNotNilOrEmpty(
                                                dataListadoGrupoFamiliar
                                            ) &&
                                            dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                                                ({
                                                    id,
                                                    nombre_familiar,
                                                    extension,
                                                    manzana,
                                                    villa,
                                                }) => {
                                                    return (
                                                        <MenuItem
                                                            value={id}
                                                            key={
                                                                'ListadoTagFilterGrupoFamiliar' +
                                                                id
                                                            }
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
                                                                    : `-${villa}`
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
                            placeholder="Buscar"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                            value={search}
                            inputProps={{
                                style: { textTransform: 'uppercase' },
                            }}
                        />

                        <ActionsButtonsExcelPdf
                            ExportExcel={ExportExcel}
                            columnsPdf={[
                                'Grupo Familiar',
                                'Tag',
                                'Placa',
                                'Marca',
                                'Modelo',
                                'Color',
                            ]}
                            idTable={'#TableListodoAsignacionTag'}
                            orientacion={'portrait'}
                            titlePdf={'Tabla de Asignacion de Tags'}
                        />
                    </div>
                    <TableContainer>
                        <Table
                            // className={classes.table}
                            padding="normal"
                            stickyHeader
                            aria-label="sticky table"
                            {...getTableProps()}
                            id={'TableListodoAsignacionTags'}
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
                        lengthData={isNilOrEmpty(dataTag) ? 0 : dataTag.length}
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

export default MantenimientoParentescoListado
