import DateFnsUtils from '@date-io/date-fns'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import React from 'react'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'
import esLocale from 'date-fns/locale/es'

interface IProps {
    classes: ClassNameMap<'textbox'>
    value?: Date
    setFieldValue: any
    touched: any
    error: any
    id: string
    labelTitulo: string
    disableFuture?: boolean
    disablePast?: boolean
}

const FormControlDate: React.FC<IProps> = ({
    classes,
    value,
    setFieldValue,
    error,
    touched,
    id,
    labelTitulo,
    disablePast = false,
    disableFuture = false,
}) => {
    return (
        <MuiPickersUtilsProvider locale={esLocale} utils={DateFnsUtils}>
            <KeyboardDatePicker
                className={classes.textbox}
                id={id}
                name={id}
                label={labelTitulo}
                inputVariant="outlined"
                format="MM/dd/yyyy"
                value={value}
                // onChange={handleChange}
                onChange={(value) => setFieldValue('fecha_nacimiento', value)}
                error={touched && isNotNilOrEmpty(error)}
                helperText={touched ? error : undefined}
                disableFuture={disableFuture}
                disablePast={disablePast}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                required
            />
        </MuiPickersUtilsProvider>
    )
}

export default FormControlDate
