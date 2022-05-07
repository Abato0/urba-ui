import React, { useCallback } from 'react'
import {
    IDataListaPagoFilter,
    IPagoGrupoFamiliarInput,
    usePagoFamiliar,
    usePagoFamiliarFilters,
} from '../../components/pago/use-pago'
import { equals, isEmpty, isNil, pluck, prop } from 'ramda'
import {
    AllPagoTable,
    headPagoTable,
} from '../../components/pago/pago-dataTable'
import TablePaginations from '../../components/table/table-paginations'
import {
    colors,
    createStyles,
    FormControl,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableContainer,
    TableFooter,
    TableRow,
    TextField,
    Tooltip,
} from '@material-ui/core'
import { ExportTablePdf } from '../../components/table/export-table-pdf'
import { usePagination, useTable } from 'react-table'
import TableHeader from '../../components/table/table-header'
import CardTableBody from '../../components/table/table-body'
import useDebounce from '../../utils/useDebounce'
import Fuse from 'fuse.js'
import { TableCell } from '@material-ui/core'
import { isNotNilOrEmpty, isNotNil } from '../../utils/is-nil-empty'
import ModalImagen from '../../components/core/input/dialog/modal-ver-imagen'
import XLSX from 'xlsx'
import { useListarGrupoFamiliar } from '../../components/grupo-familiar/use-grupo-familia'
import { SelectMeses } from '../../components/core/input/select/select-meses'
import { SelectAnios } from '../../components/core/input/select/select-anios'
import { SelectChangeEvent } from '@mui/material'
import { SelectTipoPago } from '../../components/core/input/select/select-tipo-pago'
import { FileExcelBox as FileExcelBoxIcon } from 'mdi-material-ui'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { ActionsButtonsFilterReset } from '../../components/core/actions/actionsButtonsFilterReset'
import { ActionsButtonsExcelPdf } from '../../components/core/actions/actionsButtonsExcelPdf'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            // width: 80
            margin: '30px',
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
            backgroundColor: colors.grey[50],
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
        // table: {
        //   backgroundColor: colors.grey[700],
        // },
    })
)

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['nombre_familiar'],
}

interface IDataTablePagoListado {
    id: number
    nombre_familiar: string
    tipo_pago: string
    fecha_pago: string
    fecha_subida: string
    descripcion: string
    fecha_recibo: string
    monto: number
}

const extractData = (data: IDataListaPagoFilter[]) => {
    console.log('data de la funcion extracData: ', data)
    return data.map(({ id, pago, grupoFamiliar }, index) => {
        return {
            ...pago,
            id,
            nombre_familiar: grupoFamiliar.nombre_familiar,

            // nombre_aporte: aporte.nombre_aporte,
            // tipo_aporte: aporte.tipo_aporte,
        }
    })
}

export const calcularMonto = (data: AllPagoTable[]) => {
    let acum = 0
    if (isNotNilOrEmpty(data)) {
        data.forEach(({ monto }) => {
            acum += monto
        })
    }
    return acum
}

const getRowId = prop('id')

const ListadoPago = () => {
    const classes = useStyles()
    // const { data, loading, error } = useAllListadoPago();
    const [allPagoData, setAllPagoData] = React.useState<
        IDataTablePagoListado[]
    >([])
    const [search, setSearch] = React.useState<string>('')
    const [idPago, setIdPago] = React.useState<number>(0)
    const [base64, setBase64] = React.useState<string>('')

    const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = React.useState<
        number | undefined
    >()

    const [mesPagoFilter, setmesPagoFilterFilter] = React.useState<
        string | undefined
    >()
    const [anioPagoFilter, setAnioPagoFilter] = React.useState<
        number | undefined
    >()

    const [tipoPagoFilter, setTipoPagoFilter] = React.useState<string>()

    const [fechaAporteFilter, setFechaAporteFilter] = React.useState<string>('')
    const [filterInput, setFilterInput] =
        React.useState<IPagoGrupoFamiliarInput>({})

    const { data, loading, error } = usePagoFamiliarFilters(filterInput)

    // const {
    //   data: dataAporte,
    //   loading: loadingAporte,
    //   error: erroAporte,
    // } = useListarAporteQuery();

    const {
        data: dataListadoGrupoFamiliar,
        loading: loadingListadoGrupoFamiliar,
        error: errorListadoGrupoFamiliar,
    } = useListarGrupoFamiliar()

    const debounceSearch = useDebounce(search, 300)
    const [open, setOpen] = React.useState(false)
    // const handleOpen = () => setOpen(!open);
    const handleClose = () => setOpen(false)

    const {
        data: dataPagoFamiliar,
        loading: loadingPagoFamiliar,
        error: errorPagoFamiliar,
    } = usePagoFamiliar(idPago)

    const idTable = React.useMemo(() => {
        return 'listadoPagoTable'
    }, [])

    const titlePdf = React.useMemo(() => {
        return 'Listado Pago'
    }, [])

    const columnsPdf = React.useMemo(() => {
        return [
            'Grupo Familiar',
            'Tipo de Pago',
            'Fecha del Pago',
            'Fecha del Recibo	',
            'Descripcion',
            'Monto',
        ]
    }, [])

    const onSeeImg = ({ id, imagen_recibo }: any) => {
        // console.log({ id });
        if (id) {
            console.log('image', imagen_recibo)
            // setBase64(null);
            setIdPago(id)
            setOpen(true)
        }
    }

    const fuse = React.useMemo(() => {
        if (!isEmpty(data) && !isNil(data)) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                // extractData(data.ListaPagos)
                extractData(data.ListaPagoFamiliarFilter)
            )
            // return new Fuse(extractData(data.ListaPagos), optionsFuse, myIndex);
            return new Fuse(
                extractData(data.ListaPagoFamiliarFilter),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    React.useEffect(() => {
        if (!loading && !isNil(data)) {
            // setAllPagoData(extractData(data.ListaPagos));
            setAllPagoData(extractData(data.ListaPagoFamiliarFilter))

            //   console.log("data: ", extractData(data.ListaPagos));
        }
        // console.log("data: ", data);
    }, [loading, data])

    React.useEffect(() => {
        if (
            !isEmpty(debounceSearch) &&
            !isNil(debounceSearch) &&
            !isNil(fuse)
        ) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setAllPagoData(result)
        } else {
            // if (data) setAllPagoData(extractData(data.ListaPagos));}
            if (data) setAllPagoData(extractData(data.ListaPagoFamiliarFilter))
        }
    }, [data, debounceSearch, fuse])

    React.useEffect(() => {
        if (!loading && isNotNilOrEmpty(dataPagoFamiliar)) {
            // console.log("dataPagoFamiliar: ", dataPagoFamiliar);
            const { pago } = dataPagoFamiliar!.GetPagoFamiliar
            const image = isNotNilOrEmpty(pago.imagen_recibo)
                ? pago.imagen_recibo
                : ''
            setBase64(pago.imagen_recibo ? pago.imagen_recibo : '')
            console.log('adsdas', image)
        }
    }, [dataPagoFamiliar, loading])

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
            columns: headPagoTable,
            data: allPagoData,
            getRowId,
            onSeeImg,
        },
        usePagination
    )

    const onChangePage = React.useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = React.useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
        [setPageSize]
    )

    const filtrar = useCallback(() => {
        setFilterInput({
            mes: isEmpty(mesPagoFilter) ? undefined : mesPagoFilter,
            anio:
                equals(anioPagoFilter, 0) || isNil(anioPagoFilter)
                    ? undefined
                    : anioPagoFilter,
            idGrupoFamiliar:
                equals(idGrupoFamiliarFilter, 0) || isNil(idGrupoFamiliarFilter)
                    ? undefined
                    : idGrupoFamiliarFilter,
            tipo_pago: isEmpty(tipoPagoFilter) ? undefined : tipoPagoFilter,
            // id_aporte: isNil(tipoAporteFilter) ? undefined : Number(tipoAporteFilter),
        })
    }, [mesPagoFilter, anioPagoFilter, idGrupoFamiliarFilter, tipoPagoFilter])

    const cancelFiltrar = () => {
        setIdGrupoFamiliarFilter(0)
        setmesPagoFilterFilter('')
        setAnioPagoFilter(0)
        setTipoPagoFilter('')
        // setFechaAporteFilter("");
        setFilterInput({})
    }

    const ExportExcel = () => {
        if (isNotNilOrEmpty(allPagoData)) {
            const newCampos = allPagoData.map(
                ({
                    descripcion,
                    fecha_pago,
                    fecha_recibo,
                    fecha_subida,
                    monto,
                    nombre_familiar,
                    tipo_pago,
                }) => {
                    return {
                        GrupoFamiliar: nombre_familiar,
                        TipoPago: tipo_pago,
                        FechaPago: fecha_pago,
                        FechaRecibo: fecha_recibo,
                        FechaSubida: fecha_subida,
                        Descripcion: descripcion,
                        Monto: monto,
                    }
                }
            )
            const workSheet = XLSX.utils.json_to_sheet(newCampos)

            workSheet.A1.v = 'Grupo familiar'
            workSheet.B1.v = 'Tipo de pago'
            workSheet.C1.v = 'Fecha del pago'
            workSheet.D1.v = 'Fecha del recibo del pago'
            workSheet.E1.v = 'Fecha de subida del pago'

            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, 'Pagos')
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Listado de Pagos Generados.xlsx')
        }
    }

    return (
        <LayoutTituloPagina titulo="Pagos - Listado">
            <Paper className={classes.paperFilter}>
                <div className={classes.contenFilter}>
                    <div className={classes.contentButtons}>
                        <div>
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
                                        // variant="outlined"
                                        labelId="idGrupoFamiliar_label"
                                        // label={<p>Grupo Familiar</p>}
                                        id="idGrupoFamiliar"
                                        name="idGrupoFamiliar"
                                        value={idGrupoFamiliarFilter}
                                        onChange={(e) =>
                                            setIdGrupoFamiliarFilter(
                                                e.target.value as number
                                            )
                                        }
                                    >
                                        <MenuItem value={undefined}>
                                            {' '}
                                            Todos{' '}
                                        </MenuItem>
                                        {!loadingListadoGrupoFamiliar &&
                                            isNotNilOrEmpty(
                                                dataListadoGrupoFamiliar
                                            ) &&
                                            dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                                                ({ id, nombre_familiar }) => {
                                                    return (
                                                        <MenuItem
                                                            key={
                                                                'GrupoFamiliarFilterListadoPago-' +
                                                                id
                                                            }
                                                            value={id}
                                                        >
                                                            {nombre_familiar}
                                                        </MenuItem>
                                                    )
                                                }
                                            )}
                                    </Select>
                                </FormControl>

                                <SelectMeses
                                    handleChange={(e: SelectChangeEvent) =>
                                        setmesPagoFilterFilter(
                                            String(e.target.value)
                                        )
                                    }
                                    value={mesPagoFilter}
                                    label={'Mes'}
                                    id={'mes_manteniento'}
                                />

                                <SelectAnios
                                    handleChange={(e: SelectChangeEvent) =>
                                        setAnioPagoFilter(
                                            Number(e.target.value)
                                        )
                                    }
                                    value={anioPagoFilter}
                                    label={'Año'}
                                    id={'anio_manteniento'}
                                />
                                <SelectTipoPago
                                    handleChange={(e: SelectChangeEvent) =>
                                        setTipoPagoFilter(
                                            String(e.target.value)
                                        )
                                    }
                                    value={tipoPagoFilter}
                                    label={'Tipo de Pago'}
                                    id={'tipo_pago'}
                                />
                            </div>
                        </div>

                        <ActionsButtonsFilterReset
                            filtrar={filtrar}
                            reset={cancelFiltrar}
                        />
                    </div>
                </div>
            </Paper>
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
                        stickyHeader
                        aria-label="sticky table"
                        {...getTableProps()}
                        id={idTable}

                        // className={classes.table}
                    >
                        <TableHeader headerGroups={headerGroups} />
                        <CardTableBody
                            getTableBodyProps={getTableBodyProps}
                            page={page}
                            prepareRow={prepareRow}
                        />
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    {calcularMonto(allPagoData)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <TablePaginations
                    lengthData={allPagoData.length}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                />
            </Paper>

            <ModalImagen
                open={open}
                handleClose={handleClose}
                base64={base64}
                classes={classes}
            />
        </LayoutTituloPagina>
    )
}

export default ListadoPago
