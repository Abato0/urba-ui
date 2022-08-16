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
import { arrMeses } from '../dateSelect'

interface IProps {
    handleChange: any
    value: any
    id: string
    label: string
    style?: any
}

const useStyles = makeStyles((theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),

            // minWidth: 220,
        },
    })
)

export const SelectHeader: React.FC<IProps> = ({
    handleChange,
    value,
    id,
    label,
    children,
    style,
}) => {
    const classes = useStyles()
    return (
        <FormControl
            style={style}
            className={classes.formControl}
            variant="filled"
        >
            <InputLabel id={id + '_label'}>{label}</InputLabel>
            <Select
                labelId={id + '_label'}
                id={id}
                onChange={handleChange}
                value={value}
            >
                {children}
                {/* {arrMeses.map((mes) => {
            return (
              <MenuItem value={mes} key={"IngresarPagoArrMes-" + mes}>
                {mes}
              </MenuItem>
            );
          })} */}
            </Select>
        </FormControl>
    )
}
