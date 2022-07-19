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
import { IArrKeyData, useCarteraVencida } from '../../components/pago/use-pago'
import { lightFormat } from 'date-fns'
import { useCallback } from 'react'
import {
    Filter as FilterIcon,
    Reload as ReloadIcon,
    FileExcelBox as FileExcelBoxIcon,
    TableSearch,
} from 'mdi-material-ui'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { COLOR_PRIMARIO } from '../../utils/keys';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            // width: 80
            margin: '30px',
            minWidth: '60%',
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
        tableBody: {
            '&:hover': {
                background: colors.deepPurple[100],
                color: 'white',
            },
        },
        tableHead: {
            background: COLOR_PRIMARIO,
            color: 'white',
            fontSize: 14,
            fontWeight: 'unset',
            fontFamily: 'Roboto',
        },
        // table: {
        //   backgroundColor: colors.grey[700],
        // },
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

export const ListadoCarteraVencida = () => {
    const [keysColumns, setKeysColumns] = useState<string[]>([])
    const classes = useStyles()
    const [dataColumnsV2, setDataColumnsV2] = useState<string[][]>([])
    const [fecha, setFecha] = useState<Date | null>(null)

    const [fechaString, setFechaString] = useState<string>('')

    const { data, loading, error } = useCarteraVencida(fechaString)

    useEffect(() => {
        if (!loading && data && data.CarteraVencida) {
            setKeysColumns(drop(1, data.CarteraVencida.keys))
            setDataColumnsV2(extractDataV2(data.CarteraVencida))
        }
    }, [loading, data])

    const filtrar = useCallback(() => {
        if (!isNil(fecha)) {
            setFechaString(lightFormat(fecha, 'MM-dd-yyyy'))
        }
    }, [fecha])

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
                'Carteria Vencida'
            )
            XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
            XLSX.writeFile(workBook, 'Cartera Vencida.xlsx')
        }
    }

    return (
        <LayoutTituloPagina titulo="Aportaciones - Catera Vencida">
            <Paper className={classes.root}>
                {/* <div className={classes.containerTitle}>
          <Typography variant="overline" className={classes.title}>
            Cartera Vencida
          </Typography> */}
                {/* </div> */}
                {/* <div className={classes.contentButtons}>
          <div></div>
          <div>
            <Button
              className={classes.button}
              color="secondary"
              //   onClick={ExportExcel}
              style={{
                backgroundColor: colors.green[800],
              }}
              startIcon={<FontAwesomeIcon icon={faFileExcel} />}
            >
              <Typography className={classes.labelButton} variant="button">
                Exportar a Excel
              </Typography>
            </Button>
          </div>
        </div> */}
                <div className={classes.contenFilter}>
                    <div className={classes.contentButtons}>
                        <div style={{ marginTop: 18 }}>
                            <SelectFecha
                                className={classes.selectFilter}
                                id={'fecha'}
                                label={'Fecha'}
                                format="MMM yyyy"
                                value={fecha}
                                handleChange={(e: MaterialUiPickersDate) =>
                                    setFecha(e)
                                }
                            />
                        </div>
                        <div
                            style={{
                                // backgroundColor: "red",
                                // minWidth: 200,
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
                <TableContainer style={{ maxHeight: 200 }}>
                    <Table stickyHeader aria-label="sticky table">
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

export default ListadoCarteraVencida
