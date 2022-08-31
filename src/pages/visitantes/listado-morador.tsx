import {
    Box,
    colors,
    createStyles,
    makeStyles,
    Paper,
    Table,
    TableContainer,
    TextField,
} from '@material-ui/core'
import { lightFormat } from 'date-fns'
import moment from 'moment'
import { isNil, pluck, prop } from 'ramda'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import { ActionsButtonsExcelPdf } from '../../components/core/actions/actionsButtonsExcelPdf'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import CardTableBody from '../../components/table/table-body'
import TableHeader from '../../components/table/table-header'
import TablePaginations from '../../components/table/table-paginations'
import {
    IVisitanteMoradorVariables,
    useDeleteVisitanteMutation,
    useListadoVisitateMoradorQuery,
} from '../../components/visitante/use-visitante'
import { columnsVisitanteMorador } from '../../components/visitante/visitante-data-table'
import { direccionGrupoFamiliar } from '../../utils/parseDate'
import Fuse from 'fuse.js'
import useDebounce from '../../utils/useDebounce'
import fuse from 'fuse.js'
import { isNotNil, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { useRouter } from 'next/router'
import ModalAuth from '../../components/core/input/dialog/modal-dialog'

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

export interface IVisianteMoradorNormalize {
    nombre_visitante: string
    descripcion: string
    fecha_visita: string
    nombre_grupo_familiar: string
    direccion: string
    id: number
}
const getRowId: any = prop('id')

const optionsFuse: Fuse.IFuseOptions<any> = {
    keys: ['nombre_visitante'],
}

const extractData = (
    data: IVisitanteMoradorVariables[]
): IVisianteMoradorNormalize[] => {
    return data.map((item) => {
        return {
            id: item.id!,
            descripcion: item.descripcion,
            nombre_visitante: item.nombre_visitante,
            fecha_visita: item.fecha_visita
                ? lightFormat(Number(item.fecha_visita), 'yyyy-MM-dd HH:mm')
                : '',
            nombre_grupo_familiar: item.grupoFamiliar.nombre_familiar,
            direccion: direccionGrupoFamiliar(item.grupoFamiliar),
        }
    })
}
const ListadoVisitanteMorador = () => {
    const classes = useStyles()
    const router = useRouter()
    const [search, setSearch] = useState<string>('')
    const [openModalMsj, setOpenModalMsj] = useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = useState<string>('')
    const debounceSearch = useDebounce(search, 300)
    const [errorModal, setErrorModal] = useState<boolean>(false)

    const [mutateEliminar] = useDeleteVisitanteMutation()
    const [dataVisitante, setDataVisitante] = useState<
        IVisianteMoradorNormalize[]
    >([])
    const { data, loading } = useListadoVisitateMoradorQuery()

    const idTable = useMemo(() => {
        return 'listadoPagoTable'
    }, [])

    const titlePdf = useMemo(() => {
        return 'Listado Pago'
    }, [])

    const onEdit = useCallback(({ id }: IVisianteMoradorNormalize) => {
        if (!isNil(id)) {
            router.push(
                { pathname: '/visitantes/ingresar-morador/[id]' },
                `/visitantes/ingresar-morador/${encodeURIComponent(id)}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDelete = useCallback(async ({ id }: IVisianteMoradorNormalize) => {
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

    const columnsPdf = useMemo(() => {
        return [
            'Grupo Familiar',
            'Visitante',
            'Fecha de Visia',
            'Descripción',
            'Dirección',
        ]
    }, [])

    useEffect(() => {
        if (!loading && data && data.ListadoVisitante) {
            const result: IVisianteMoradorNormalize[] = extractData(
                data.ListadoVisitante
            )
            setDataVisitante(result)
            // setDataVisitante(data.ListadoVisitante)
        }
    }, [loading, data])

    const fuse = useMemo(() => {
        if (data && data.ListadoVisitante) {
            const myIndex = Fuse.createIndex(
                optionsFuse.keys!,
                extractData(data.ListadoVisitante)
            )
            return new Fuse(
                extractData(data.ListadoVisitante),
                optionsFuse,
                myIndex
            )
        }
    }, [data])

    useEffect(() => {
        if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
            const result = pluck('item', fuse.search(String(debounceSearch)))
            // console.log("result:", fuse.search(String(debounceSearch)));
            setDataVisitante(result)
        } else {
            setDataVisitante(extractData(data ? data.ListadoVisitante : []))
        }
    }, [data, debounceSearch, fuse])

    const ExportExcel = () => {
        // if (isNotNilOrEmpty(allPagoData)) {
        //     const newCampos = allPagoData.map(
        //         ({
        //             descripcion,
        //             fecha_pago,
        //             fecha_recibo,
        //             fecha_subida,
        //             monto,
        //             nombre_familiar,
        //             tipo_pago,
        //         }) => {
        //             return {
        //                 GrupoFamiliar: nombre_familiar,
        //                 TipoPago: tipo_pago,
        //                 FechaPago: fecha_pago,
        //                 FechaRecibo: fecha_recibo,
        //                 FechaSubida: fecha_subida,
        //                 Descripcion: descripcion,
        //                 Monto: monto,
        //             }
        //         }
        //     )
        //     const workSheet = XLSX.utils.json_to_sheet(newCampos)
        //     workSheet.A1.v = 'Grupo familiar'
        //     workSheet.B1.v = 'Tipo de pago'
        //     workSheet.C1.v = 'Fecha del pago'
        //     workSheet.D1.v = 'Fecha del recibo del pago'
        //     workSheet.E1.v = 'Fecha de subida del pago'
        //     const workBook = XLSX.utils.book_new()
        //     XLSX.utils.book_append_sheet(workBook, workSheet, 'Aportaciones')
        //     XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
        //     XLSX.writeFile(workBook, 'Listado de Aportaciones Generados.xlsx')
        // }
    }

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
            columns: columnsVisitanteMorador,
            data: dataVisitante,
            getRowId,
            onEdit,
            onDelete,
            // onEdit,
            // onDescargar,
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
        <LayoutTituloPagina titulo="Visitante - Listado">
            <Paper className={classes.root}>
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
                <div className={classes.contentButtons}>
                    {/* <TextField
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
                            /> */}

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
        </LayoutTituloPagina>
    )
}

export default ListadoVisitanteMorador
