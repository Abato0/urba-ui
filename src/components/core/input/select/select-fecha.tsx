import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import { FC } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { es } from 'date-fns/locale'

export const SelectFecha = ({
    value,
    handleChange,
    id,
    // format,
    label,
    ...props
}: any) => {
    return (
        <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
            <KeyboardDatePicker
                id={id}
                name={id}
                label={label}
                inputVariant="outlined"
                value={value}
                onChange={handleChange}
                {...props}
            />
        </MuiPickersUtilsProvider>
    )
}
