import {
    Button,
    colors,
    createStyles,
    makeStyles,
    Typography,
} from '@material-ui/core'
import React from 'react'
import { FILE_SIZE } from './vehiculo-form'
import { COLOR_SECUDARIO, COLOR_PRIMARIO } from '../../utils/keys'

interface IProps {
    label: string
    id: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    value?: File | null
}

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            margin: theme.spacing(2),
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: colors.grey[500],
            borderRadius: theme.spacing(2),
            padding: theme.spacing(1),
            alignItems: 'center',
            // backgroundColor: "red",
        },
        buttonCargarImagen: {
            '&:hover': {
                backgroundColor: COLOR_SECUDARIO,
                color: 'white',
            },
            margin: theme.spacing(2),
            width: 120,
            backgroundColor: COLOR_PRIMARIO,
            color: 'white',
            fontWeight: 'bolder',
            fontSize: theme.typography.pxToRem(11),
        },
    })
)

export const ButtonCargarImagen: React.FC<IProps> = ({
    id,
    label,
    value,
    onBlur,
    children,
    onChange,
}) => {
    const classes = useStyles()
    return (
        <div className={classes.container}>
            <Button
                className={classes.buttonCargarImagen}
                variant="outlined"
                component="label"
            >
                {label}
                <input
                    type="file"
                    id={id}
                    name={id}
                    onChange={onChange}
                    onBlur={onBlur}
                    accept="image/*"
                    hidden
                />
            </Button>
            <div style={{ maxWidth: 150, margin: 3 }}>
                <Typography
                    variant="caption"
                    style={{ fontSize: 12, textAlign: 'center', padding: 4 }}
                >
                    {value && value.size > FILE_SIZE
                        ? `${label} tamaño no soportado`
                        : value && value.size <= FILE_SIZE
                        ? `${label} cargada`
                        : `${label} no cargada`}
                </Typography>
            </div>
            {children}
        </div>
    )
}
