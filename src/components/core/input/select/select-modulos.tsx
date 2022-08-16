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
import { arrMeses, arrModulos } from '../dateSelect'
import { SelectHeader } from './select-header'

interface IProps {
    handleChange: any
    value?: string
    id: string
    label: string
    style?: any
}

export const SelectModulos: React.FC<IProps> = ({
    handleChange,
    value,
    id,
    label,
    style,
}) => {
    return (
        <SelectHeader
            handleChange={handleChange}
            value={value}
            id={id}
            label={label}
            style={style}
        >
            <MenuItem
                style={{
                    textTransform: 'uppercase',
                }}
                value={undefined}
            >
                {' '}
                - Todos -{' '}
            </MenuItem>
            {arrModulos.map(({ label, value }) => {
                return (
                    <MenuItem
                        style={{
                            textTransform: 'uppercase',
                        }}
                        value={value}
                        key={id + 'Modulo - ' + value}
                    >
                        {label}
                    </MenuItem>
                )
            })}
        </SelectHeader>
    )
}
