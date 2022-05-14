import XLSX from 'xlsx'
import {
    Button,
    colors,
    createStyles,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { drop, isEmpty, isNil, zipObj } from 'ramda'
import React, { useEffect, useState } from 'react'
import { SelectFecha } from '../../components/core/input/select/select-fecha'
import AppLayout from '../../components/layout/app-layout'
import {
    IArrKeyData,
    useCarteraVencida,
    useMatrizOperaciones,
} from '../../components/pago/use-pago'
import { lightFormat } from 'date-fns'
import { useCallback } from 'react'
import {
    Filter as FilterIcon,
    Reload as ReloadIcon,
    FileExcelBox as FileExcelBoxIcon,
    TableSearch,
} from 'mdi-material-ui'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import NavBar from '../../components/layout/app-bar'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { DateDesdeHasta } from '../../components/core/input/dateDesdeHasta'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            // width: 80
            margin: '30px',
            width: '80%',
        },
        contentButtons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignContent: "center",
            alignItems: 'center',
            width: '100%',
            padding: theme.spacing(2),
            marginTop: theme.spacing(1),
            // marginBottom: 18
        },
        selectFecha: {
            display: 'flex',
            //   width: theme.spacing(10),
            margin: theme.spacing(1),
            flexDirection: 'column',
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
        tableBody: {
            '&:hover': {
                background: colors.deepPurple[100],
                color: 'white',
            },
        },
        tableHead: {
            background: colors.deepPurple[400],
            color: 'white',
            fontSize: 14,
            fontWeight: 'unset',
            fontFamily: 'Roboto',
        },
    })
)

const extractDataV2 = (dataConsulta: IArrKeyData) => {
    if (!isEmpty(dataConsulta.keys) && !isEmpty(dataConsulta.data)) {
        return dataConsulta.data.map((item) => {
            return drop(1, item.split('|'))
            // return zipObj(dataConsulta.keys, itemSplit);
        })
    } else {
        return []
    }
}

export const ListadoMatrizOperaciones = () => {
    const [keysColumns, setKeysColumns] = useState<string[]>([])
    const classes = useStyles()
    const [dataColumnsV2, setDataColumnsV2] = useState<string[][]>([])
    const [fechaDesde, setFechaDesde] = useState<Date | null>(null)
    const [fechaHasta, setFechaHasta] = useState<Date | null>(null)

    const [fechaDesdeString, setFechaDesdeString] = useState<string>('')

    const [fechaHastaString, setFechaHastaString] = useState<string>('')
    const { data, loading, error } = useMatrizOperaciones(
        fechaDesdeString,
        fechaHastaString
    )

    useEffect(() => {
        if (!loading && data && data.MatrizOperaciones) {
            setKeysColumns(drop(1, data.MatrizOperaciones.keys))
            setDataColumnsV2(extractDataV2(data.MatrizOperaciones))
        }
    }, [loading, data])

    const filtrar = useCallback(() => {
        if (!isNil(fechaDesde) && !isNil(fechaHasta)) {
            setFechaDesdeString(lightFormat(fechaDesde, 'MM-dd-yyyy'))
            setFechaHastaString(lightFormat(fechaHasta, 'MM-dd-yyyy'))
        }
    }, [fechaDesde, fechaHasta])

    const ExportExcel = () => {
        if (isNotNilOrEmpty(dataColumnsV2) && isNotNilOrEmpty(keysColumns)) {
            const newCampos = dataColumnsV2.map((item) => {
                return zipObj(keysColumns, item)
            })

            const workSheet = XLSX.utils.json_to_sheet(newCampos)

            //console.log("dataColumns: ", dataColumnsV2, newCampos);
            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(
                workBook,
                workSheet,
                'Matriz de Operacione'
            )
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Matriz de Aportaciones.xlsx')
        }
    }

    return (
        <LayoutTituloPagina titulo="Pagos - Matriz de Aportaciones">
            <Paper className={classes.root}>
                <div className={classes.contenFilter}>
                    <div className={classes.contentButtons}>
                        <DateDesdeHasta
                            fechaDesde={fechaDesde}
                            fechaHasta={fechaHasta}
                            handleChangeDesde={(e: MaterialUiPickersDate) =>
                                setFechaDesde(e)
                            }
                            handleChangeHasta={(e: MaterialUiPickersDate) =>
                                setFechaHasta(e)
                            }
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <Tooltip title="Filtrar" placement="top">
                                <IconButton color="primary" onClick={filtrar}>
                                    <TableSearch color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Exportar a Excel">
                                <IconButton onClick={ExportExcel}>
                                    <FileExcelBoxIcon
                                        fontSize="large"
                                        style={{
                                            color: colors.green[800],
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <TableContainer style={{ maxHeight: 800, width: '100%' }}>
                    <Table
                        style={{ overflow: 'auto' }}
                        stickyHeader
                        aria-label="sticky table"
                    >
                        <TableHead>
                            <TableRow>
                                {keysColumns.map((item, index) => {
                                    return (
                                        <TableCell
                                            className={classes.tableHead}
                                            align="center"
                                            key={index}
                                        >
                                            {item}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataColumnsV2.map((rowData, index) => {
                                return (
                                    <TableRow
                                        className={classes.tableBody}
                                        key={index}
                                    >
                                        {rowData.map((columnData, index) => {
                                            return (
                                                <TableCell
                                                    align="center"
                                                    key={index}
                                                >
                                                    {columnData}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </LayoutTituloPagina>
    )
}

export default ListadoMatrizOperaciones
