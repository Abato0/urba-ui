import { makeStyles } from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { FC } from 'react'
import { SelectFecha } from './select/select-fecha'

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 18,
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    selectFecha: {
        display: 'flex',
        //   width: theme.spacing(10),
        margin: theme.spacing(1),
        flexDirection: 'column',
    },
}))

interface IProps {
    fechaDesde: Date | null
    fechaHasta: Date | null
    handleChangeDesde: (e: MaterialUiPickersDate) => void
    handleChangeHasta: (e: MaterialUiPickersDate) => void
}
0

export const DateDesdeHasta: FC<IProps> = ({
    fechaDesde,
    fechaHasta,
    handleChangeDesde,
    handleChangeHasta,
}) => {
    const classes = useStyles()
    return (
        <div
            style={{
                marginTop: 18,
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                //                backgroundColor: "red"
            }}
        >
            <div className={classes.selectFecha}>
                <SelectFecha
                    id={'fechaDesde'}
                    label={'Desde'}
                    format="MMM yyyy"
                    value={fechaDesde}
                    handleChange={(e: MaterialUiPickersDate) =>
                        handleChangeDesde(e)
                    }
                />
            </div>

            <div className={classes.selectFecha}>
                <SelectFecha
                    id={'fechaHasta'}
                    label={'Hasta'}
                    format="MMM yyyy"
                    value={fechaHasta}
                    handleChange={(e: MaterialUiPickersDate) =>
                        handleChangeHasta(e)
                    }
                />
            </div>
        </div>
    )
}
