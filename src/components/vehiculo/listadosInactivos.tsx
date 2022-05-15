import {
    makeStyles,
    createStyles,
    colors,
    Button,
    Paper,
    Table,
    TableContainer,
    TextField,
} from '@material-ui/core'
import { join, keys, omit, prop, union } from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { useTable, usePagination, useRowSelect } from 'react-table'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { ExportTablePdf } from '../table/export-table-pdf'
import CardTableBody from '../table/table-body'
import TableHeader from '../table/table-header'
import TablePaginations from '../table/table-paginations'
import {
    IListadoVehiculo,
    IListadoVehiculoInactivos,
    IVehiculoVariableNormalize,
    useActivadorVehiculoMutation,
    useListadoVehiculosInactivosQuery,
    useListadoVehiculosQuery,
} from './use-vehiculo'
import {
    headVehiculoActivacionTable,
    headVehiculoTable,
} from './vehiculo-dataTable'
import XLSX from 'xlsx'
import IndeterminateCheckbox from '../table/checkbox-cell'
import ModalAuth from '../core/input/dialog/modal-dialog'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: '12px',
            margin: '30px',
            maxWidth: '800px',
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
            height: '50%',
            backgroundColor: colors.blueGrey[900],
            '&:hover': {
                backgroundColor: colors.blueGrey[800],
            },
            minWidth: 100,
            maxHeight: 40,
        },
        textBox: {
            backgroundColor: '',
        },
        contentButtonActivar: {
            display: 'flex',
            justifyContent: 'end',
            alignContent: 'center',
            padding: theme.spacing(4),
            backgroundColor: colors.yellow[100],
            //   marginTop: theme.spacing(4),
            //   marginBottom: theme.spacing(4)
        },
        // table: {
        //   backgroundColor: colors.grey[600],
        // },
    })
)

const extractData = (
    data: IListadoVehiculoInactivos
): IVehiculoVariableNormalize[] => {
    // return isNotNilOrEmpty(data)
    //     ? data.ListaVehiculosInactivos.map(({ grupoFamiliar, ...props }) => {
    //         return omit(['__typename', 'matriculaPdf'], {
    //             nombre_familiar: grupoFamiliar.nombre_familiar,
    //             ...props,
    //         })
    //     })
    //     : []

    return []
}

const getRowId: any = prop('id')
const idTable = 'idListadoIntegranteTable'
const titlePdf = 'Listado de Vehiculos por Familia'
const columnsPdf = [
    'Nombre Familiar',
    'Tipo Vehiculo',
    'Placa',
    'Marca',
    'Color',
    'Modelo',
]

const ListadoInactivos = () => {
    const classes = useStyles()
    const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false)
    const [titleModalMsj, setTitleModalMsj] = React.useState<string>('')
    const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>('')
    const [errorModal, setErrorModal] = React.useState<boolean>(false)

    const [allVehiculo, setAllVehiculo] = useState<
        IVehiculoVariableNormalize[]
    >([])
    const [search, setSearch] = useState<string>('')
    const { data, loading, error } = useListadoVehiculosInactivosQuery()

    useEffect(() => {
        if (!loading && isNotNilOrEmpty(data)) {
            setAllVehiculo(extractData(data!))
        }
    }, [loading, data])

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
            columns: headVehiculoActivacionTable,
            data: allVehiculo,
            getRowId,
            //   onEdit,
            //   onDescargar,
        },
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <IndeterminateCheckbox
                                {...getToggleAllPageRowsSelectedProps()}
                            />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }: any) => (
                        <div>
                            <IndeterminateCheckbox
                                {...row.getToggleRowSelectedProps()}
                            />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    )

    const [mutate] = useActivadorVehiculoMutation()

    const ExportExcel = useCallback(() => {
        if (isNotNilOrEmpty(allVehiculo)) {
            const workSheet = XLSX.utils.json_to_sheet(allVehiculo)
            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, 'Vehiculos')
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Listado de Vehiculos Activos.xlsx')
        }
    }, [allVehiculo])

    const onChangePage = useCallback(
        (event, page) => gotoPage(page),
        [gotoPage]
    )

    const onChangeRowsPerPage = useCallback(
        (event, rowsPerPage) => setPageSize(rowsPerPage.props.value),
        [setPageSize]
    )

    const activarSeleccionados = useCallback(async () => {
        if (isNotNilOrEmpty(selectedRowIds)) {
            const ids = join(',', keys(selectedRowIds))
            console.log('Seleccionados: ', ids)

            const { data, loading, error } = await mutate({
                variables: {
                    id: ids,
                },
            })

            if (!loading && data) {
                const { message } = data.ActivarVehiculos

                setErrorModal(false)
                setOpenModalMsj(true)
                setTitleModalMsj(message)
            } else if (!loading && data === null) {
                setOpenModalMsj(true)
                setTitleModalMsj('Error Inactivar Vehiculo')
                setErrorModal(true)
            }
        }
    }, [selectedRowIds])

    return (
        <div>
            {openModalMsj && (
                <ModalAuth
                    openModal={openModalMsj}
                    setOpenModal={setOpenModalMsj}
                    title={titleModalMsj}
                    message={mensajeModalMsj}
                    error={errorModal}
                />
            )}
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
                    <div>
                        <ExportTablePdf
                            classes={classes.button}
                            idTable={idTable}
                            title={titlePdf}
                            columns={columnsPdf}
                        />
                        <Button
                            className={classes.button}
                            color="secondary"
                            onClick={ExportExcel}
                        >
                            Export Excel
                        </Button>
                    </div>
                </div>
                <div className={classes.contentButtonActivar}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={activarSeleccionados}
                    >
                        {' '}
                        Activar Seleccionados
                    </Button>
                </div>
                {/* <>{children}</> */}

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
        </div>
    )
}

export default ListadoInactivos
