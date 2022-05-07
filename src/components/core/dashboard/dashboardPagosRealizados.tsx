import React, { useCallback, useMemo, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
    Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { lightFormat } from 'date-fns'
import { isNil } from 'ramda'
import {
    colors,
    createStyles,
    IconButton,
    makeStyles,
    Paper,
    Tooltip as TooltipMaterial,
    Typography,
} from '@material-ui/core'
import { IPagoDashboardQuery, usePagosDashboard } from '../../pago/use-pago'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { DateDesdeHasta } from '../input/dateDesdeHasta'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            borderRadius: '12px',
            // width: 80
            margin: '30px',
            minWidth: '60%',
            padding: theme.spacing(2),
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerButton: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
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

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        // title: {
        //     display: true,
        //     text: 'Historial Pagos',
        //     fullSize: true
        // },
    },
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend, Tooltip)

// const labels = ['January']

// export const dataPrueba = {
//     labels,
//     datasets: [
//         {
//             label: 'Dataset 1',
//             data: labels.map(() =>
//                 faker.datatype.number({ min: 0, max: 1000 })
//             ),
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             label: 'Dataset 2',
//             data: labels.map(() =>
//                 faker.datatype.number({ min: 0, max: 1000 })
//             ),
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         },
//     ],
// }

const extractLabels = (data?: IPagoDashboardQuery) => {
    return data && data.ListadoPagosDashboard
        ? data.ListadoPagosDashboard.fechas
        : []
}

const extractData = (data?: IPagoDashboardQuery) => {
    return data && data.ListadoPagosDashboard
        ? data.ListadoPagosDashboard.implementacion.map((monto) => monto)
        : []
}

export const DashBoardPagosRealizados = () => {
    const classes = useStyles()

    const [fechaDesde, setFechaDesde] = useState<Date | null>(null)
    const [fechaHasta, setFechaHasta] = useState<Date | null>(null)

    const [fechaDesdeString, setFechaDesdeString] = useState<string>('')
    const [fechaHastaString, setFechaHastaString] = useState<string>('')

    const filtrar = useCallback(() => {
        if (!isNil(fechaDesde) && !isNil(fechaHasta)) {
            setFechaDesdeString(lightFormat(fechaDesde, 'MM-dd-yyyy'))
            setFechaHastaString(lightFormat(fechaHasta, 'MM-dd-yyyy'))
        }
    }, [fechaDesde, fechaHasta])

    const { data, loading, error } = usePagosDashboard(
        fechaDesdeString,
        fechaHastaString
    )

    const dataHistarial = useMemo(() => {
        return !loading && data && data.ListadoPagosDashboard
            ? {
                  labels: extractLabels(data),
                  datasets: [
                      {
                          label: 'Mantenimiento',
                          data: data.ListadoPagosDashboard.mantenimiento.map(
                              ({ monto }) => monto
                          ),
                          backgroundColor: colors.blue[400],
                      },
                      {
                          label: 'Implementación',
                          data: data.ListadoPagosDashboard.implementacion.map(
                              ({ monto }) => monto
                          ),
                          backgroundColor: colors.indigo[400],
                      },
                      {
                          label: 'Tags',
                          data: data.ListadoPagosDashboard.tag.map(
                              ({ monto }) => monto
                          ),
                          backgroundColor: colors.deepPurple[400],
                      },
                      {
                          label: 'Otros',
                          data: data.ListadoPagosDashboard.otros.map(
                              ({ monto }) => monto
                          ),
                          backgroundColor: colors.grey[400],
                      },
                  ],
              }
            : {
                  labels: [],
                  datasets: [],
              }
    }, [data, loading])

    console.log('data: ', extractData(data))

    return (
        <>
            <Paper className={classes.root}>
                <div className={classes.containerTitle}>
                    <Typography variant="overline" className={classes.title}>
                        Historial de Pagos
                    </Typography>
                </div>
                <div className={classes.headerButton}>
                    <div>
                        {' '}
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
                    </div>
                    <TooltipMaterial title="Filtrar" placement="top">
                        <IconButton color="primary" onClick={filtrar}>
                            <SearchIcon color="primary" />
                        </IconButton>
                    </TooltipMaterial>
                </div>

                <Bar options={options} data={dataHistarial} />
            </Paper>
        </>
    )
}
