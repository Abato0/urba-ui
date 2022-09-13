import {
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
} from '@material-ui/core'
import { ClassNameMap } from '@material-ui/styles'
import { colors } from '@mui/material'
import { isEmpty } from 'ramda'
import React, { ChangeEvent } from 'react'
import { isNotNilOrEmpty } from '../../../utils/is-nil-empty'

interface IProps {
    value: any
    classes: ClassNameMap<'textbox' | 'formControl'>
    handleChange: (e: ChangeEvent<any>) => void
    handleBlur: any
    labetTitulo: string
    id: string
    disabled?: boolean
    error?: string
    touched?: boolean
}

const FormControlHeader: React.FC<IProps> = ({
    classes,
    handleBlur,
    handleChange,
    value,
    children,
    id,
    labetTitulo,
    disabled = false,
    error,
    touched,
}) => {
    return (
        <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id={id + '_label'} style={{ fontSize: '12px' }}>
                {labetTitulo}
            </InputLabel>
            <Select
                labelId={id + '_label'}
                // style={{ backgroundColor: colors.deepPurple[50] }}
                id={id}
                name={id}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={classes.textbox}
                //required
                disabled={disabled}
                style={{
                    textTransform: 'uppercase',
                }}
                error={error && !isEmpty(error) ? true : false}
            >
                {children}
            </Select>
            {error && (
                <FormHelperText style={{ color: '#d91073' }} variant="filled">
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    )
}

export default FormControlHeader
