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
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    IListarFilter,
    IListarFilterVehiculoInput,
    IVehiculoVariableNormalize,
    useListadoVehiculoFilterQuery,
} from '../../components/vehiculo/use-vehiculo'
import { useState } from 'react'
import { usePagination, useTable } from 'react-table'
import { prop, isEmpty, equals, isNil } from 'ramda'
import { headVehiculoTable } from '../../components/vehiculo/vehiculo-dataTable'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'
import TablePaginations from '../../components/table/table-paginations'
import CardTableBody from '../../components/table/table-body'
import TableHeader from '../../components/table/table-header'
import XLSX from 'xlsx'
import { useListarGrupoFamiliar } from '../../components/grupo-familiar/use-grupo-familia'
import { useListaMarcaQuery } from '../../components/mantenimento/marca/use-marca'
import { useListaModeloQuery } from '../../components/mantenimento/modelo/use-modelo'
//import { useListaStatusVehiculoQuery } from '../../components/mantenimento/status-vehiculo/use-status-vehiculo'
import { CarruselVehiculoImagenModal } from '../../components/core/input/dialog/modal-carrusel-imagen-vahiculos'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { ActionsButtonsExcelPdf } from '../../components/core/actions/actionsButtonsExcelPdf'

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

const extractData = (data: IListarFilter): IVehiculoVariableNormalize[] => {
    return isNotNilOrEmpty(data)
        ? data.ListaVehiculoFilter.map(
              ({ grupoFamiliar, color, marca, modelo, ...props }) => {
                  return {
                      nombre_familiar: `${grupoFamiliar.nombre_familiar} - ${grupoFamiliar.manzana.manzana} - ${grupoFamiliar.villa}`,
                      marca: marca.marca,
                      color: color.color,
                      modelo: modelo.modelo,
                      // status: status.statusVehiculo,
                      ...props,
                  }
              }
          )
        : []
}

const getRowId: any = prop('id')
const idTable = 'idListadoVehiculoTable'
const titlePdf = 'Listado de Vehiculos por Familia'
const columnsPdf = [
    'Nombre Familiar',
    'Tipo Vehiculo',
    'Placa',
    'Marca',
    'Color',
    'Modelo',
]

const ListadoVehiculo = () => {
    const classes = useStyles()
    const router = useRouter()
    const [allVehiculo, setAllVehiculo] = useState<
        IVehiculoVariableNormalize[]
    >([])
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')

    const [idGrupoFamiliar, setIdGrupoFamiliar] = useState<number | undefined>(
        0
    )
    const [marca, setMarca] = useState<number | undefined>(0)
    const [modelo, setModelo] = useState<number | undefined>(0)
    // const [status, setStatus] = useState<string>('')
    const [idVehiculoSeleccionado, setIdVehiculoSeleccionado] = useState<
        number | undefined
    >(0)

    const [inputFilter, setInputFilter] = useState<IListarFilterVehiculoInput>(
        {}
    )

    const { data, loading, error } = useListadoVehiculoFilterQuery(inputFilter)

    const {
        data: dataListadoGrupoFamiliar,
        loading: loadingListadoGrupoFamiliar,
        error: errorListadoGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const {
        data: dataModelo,
        loading: loadingModelo,
        error: errorModelo,
    } = useListaModeloQuery()

    const {
        data: dataMarca,
        loading: loadingMarca,
        error: errorMarca,
    } = useListaMarcaQuery()

    // const {
    //     data: dataStatus,
    //     loading: loadingStatus,
    //     error: errorStatus,
    // } = useListaStatusVehiculoQuery()

    const filtrar = useCallback(() => {
        setInputFilter({
            idGrupoFamiliar:
                equals(idGrupoFamiliar, 0) || isNil(idGrupoFamiliar)
                    ? undefined
                    : idGrupoFamiliar,
            marca: isEmpty(marca) || equals(marca, 0) ? undefined : marca,
            modelo: isEmpty(modelo) || equals(modelo, 0) ? undefined : modelo,
            // status: isEmpty(status) ? undefined : status,
        })
    }, [idGrupoFamiliar, marca, modelo])

    const reset = useCallback(() => {
        // setIdGrupoFamiliarFilter(undefined);
        setMarca(0)
        // setClleInterseccionFilter("");
        setModelo(0)
        // setStatus('')
        setIdGrupoFamiliar(0)
        setInputFilter({})
    }, [])

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setAllVehiculo(extractData(data!))
        }
    }, [loading, data])

    const onEdit = useCallback(
        ({ id }: any) => {
            if (!isNil(id)) {
                router.push(
                    { pathname: '/vehiculo/ingresar/[id]' },
                    `/vehiculo/ingresar/${encodeURIComponent(id)}`
                )
            }
        },
        [router]
    )

    const onDelete = () => {
        console.log('dasd')
    }

    const ExportExcel = useCallback(() => {
        if (isNotNilOrEmpty(allVehiculo)) {
            const newCampos = allVehiculo.map(
                ({ color, marca, modelo, nombre_familiar, placa, id }) => {
                    return {
                        ID: id,
                        GrupoFamiliar: nombre_familiar,
                        Marca: marca,
                        Modelo: modelo,
                        Placa: placa,
                        Color: color,
                        // Status: status,
                    }
                }
            )
            const workSheet = XLSX.utils.json_to_sheet(newCampos)
            workSheet.B1.v = 'Grupo Familiar'
            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, 'Vehiculos')
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Listado de Vehiculos Activos.xlsx')
        } else {
            setOpenModalMsj(true)
            setTitleModalMsj('Tabla vacia')
        }
    }, [allVehiculo])

    const [openModal, setOpenModal] = React.useState(false)
    // const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpenModal(!openModal)

    const onDescargar = useCallback(({ id }: any) => {
        if (!isNil(id)) {
            console.log('id: ', id)
            setIdVehiculoSeleccionado(id)
            setOpenModal(true)
        }

        // if (isNotNilOrEmpty(matriculaPdf)) {
        //   const linkSource = `data:application/pdf;base64,${matriculaPdf}`;
        //   const downloadLink = document.createElement("a");
        //   const fileName = "Matricula de Vehiculo.pdf";
        //   downloadLink.href = linkSource;
        //   downloadLink.download = fileName;
        //   downloadLink.click();
        // } else {
        //   setOpenModalMsj(true);
        //   setTitleModalMsj("Documento no encontrado");
        // }
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
            columns: headVehiculoTable,
            data: allVehiculo,
            getRowId,
            onEdit,
            onDescargar,
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
        <LayoutTituloPagina titulo="Vehiculo - Listado">
            {!loading && (
                <>
                    {openModalMsj && (
                        <ModalAuth
                            openModal={openModalMsj}
                            // setOpenModal={setOpenModalMsj}
                            onClose={() => {
                                setOpenModalMsj(false)
                            }}
                            title={titleModalMsj}
                            message={mensajeModalMsj}
                        />
                    )}
                    <CarruselVehiculoImagenModal
                        open={openModal}
                        handleClose={handleClose}
                        id={idVehiculoSeleccionado}
                    />
                    <Paper className={classes.paperFilter}>
                        <div className={classes.contenFilter}>
                            <div className={classes.contentButtons}>
                                <div className={classes.contentForm}>
                                    <div>
                                        <FormControl
                                            variant="filled"
                                            className={classes.formControl}
                                        >
                                            <InputLabel id="idGrupoFamiliar_label">
                                                Grupo Familiar
                                            </InputLabel>
                                            <Select
                                                // className={classes.selectFilter}
                                                labelId="idGrupoFamiliar_label"
                                                value={idGrupoFamiliar}
                                                onChange={(e) =>
                                                    setIdGrupoFamiliar(
                                                        e.target.value as number
                                                    )
                                                }
                                            >
                                                <MenuItem value={0}>
                                                    TODOS
                                                </MenuItem>
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
                                                                    value={id}
                                                                    key={index}
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

                                        <FormControl
                                            variant="filled"
                                            className={classes.formControl}
                                        >
                                            <InputLabel id="marca_label">
                                                Marca
                                            </InputLabel>
                                            <Select
                                                // className={classes.selectFilter}
                                                labelId="marca_label"
                                                value={marca}
                                                onChange={(e) =>
                                                    setMarca(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                <MenuItem value={'0'}>
                                                    TODOS
                                                </MenuItem>
                                                {!loadingMarca &&
                                                    isNotNilOrEmpty(
                                                        dataMarca
                                                    ) &&
                                                    dataMarca?.ListaMarca.map(
                                                        ({ id, marca }) => {
                                                            return (
                                                                <MenuItem
                                                                    key={
                                                                        'listado-filter-marca-' +
                                                                        id
                                                                    }
                                                                    value={id}
                                                                    style={{
                                                                        textTransform:
                                                                            'uppercase',
                                                                    }}
                                                                >
                                                                    {marca}
                                                                </MenuItem>
                                                            )
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>

                                        <FormControl
                                            variant="filled"
                                            className={classes.formControl}
                                        >
                                            <InputLabel id="modelo_label">
                                                Modelo
                                            </InputLabel>
                                            <Select
                                                // className={classes.selectFilter}
                                                labelId="modelo_label"
                                                value={modelo}
                                                onChange={(e) =>
                                                    setModelo(
                                                        Number(e.target.value)
                                                    )
                                                }
                                            >
                                                <MenuItem value={'0'}>
                                                    TODOS
                                                </MenuItem>
                                                {!loadingModelo &&
                                                    isNotNilOrEmpty(
                                                        dataModelo
                                                    ) &&
                                                    dataModelo?.ListaModelo.map(
                                                        ({ id, modelo }) => {
                                                            return (
                                                                <MenuItem
                                                                    key={
                                                                        'listado-filter-modelo-' +
                                                                        id
                                                                    }
                                                                    value={id}
                                                                    style={{
                                                                        textTransform:
                                                                            'uppercase',
                                                                    }}
                                                                >
                                                                    {modelo}
                                                                </MenuItem>
                                                            )
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl>

                                        {/* <FormControl
                                            variant="filled"
                                            className={classes.formControl}
                                        >
                                            <InputLabel id="status_label">
                                                Status
                                            </InputLabel>
                                            <Select
                                                // className={classes.selectFilter}
                                                labelId="status_label"
                                                value={status}
                                                onChange={(e) =>
                                                    setStatus(
                                                        e.target.value as string
                                                    )
                                                }
                                            >
                                                <MenuItem value={undefined}>
                                                    {' '}
                                                    - Todos -{' '}
                                                </MenuItem>
                                                {!loadingStatus &&
                                                    isNotNilOrEmpty(
                                                        dataStatus
                                                    ) &&
                                                    dataStatus?.ListaStatusVehiculo.map(
                                                        ({
                                                            id,
                                                            statusVehiculo,
                                                        }) => {
                                                            return (
                                                                <MenuItem
                                                                    key={
                                                                        'listado-filter-statusVehiculo-' +
                                                                        id
                                                                    }
                                                                    value={
                                                                        statusVehiculo
                                                                    }
                                                                >
                                                                    {
                                                                        statusVehiculo
                                                                    }
                                                                </MenuItem>
                                                            )
                                                        }
                                                    )}
                                            </Select>
                                        </FormControl> */}
                                    </div>
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
                                columnsPdf={columnsPdf}
                                idTable={idTable}
                                orientacion={'landscape'}
                                titlePdf={titlePdf}
                            />
                        </div>

                        <TableContainer>
                            <Table
                                // className={classes.table}
                                stickyHeader
                                aria-label="sticky table"
                                {...getTableProps()}
                                id={idTable}
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
                            lengthData={allVehiculo.length}
                            onChangePage={onChangePage}
                            onChangeRowsPerPage={onChangeRowsPerPage}
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                        />
                    </Paper>
                </>
            )}
        </LayoutTituloPagina>
    )
}

export default ListadoVehiculo
