import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import { SelectChangeEvent } from '@mui/material'
import React from 'react'
import { arrMeses, arrAnios } from '../dateSelect'
import { SelectHeader } from './select-header'

interface IProps {
    handleChange: any
    value?: number
    id: string
    label: string
    style?: any
}

export const SelectAnios: React.FC<IProps> = ({
    handleChange,
    value,
    id,
    label,
    style = { width: '100%' },
}) => {
    return (
        <SelectHeader
            handleChange={handleChange}
            value={value}
            id={id}
            label={label}
            style={style}
        >
            {arrAnios.map((anios) => {
                return (
                    <MenuItem value={anios} key={id + 'Anios-' + anios}>
                        {anios}
                    </MenuItem>
                )
            })}
        </SelectHeader>
    )
}
