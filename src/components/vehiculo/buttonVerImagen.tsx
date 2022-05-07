import { Button, colors, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import { COLOR_PRIMARIO, COLOR_SECUDARIO } from '../../utils/keys'
import VisibilityIcon from '@material-ui/icons/Visibility'

interface IProps {
    onclick: () => void
}

const useStyles = makeStyles((theme) =>
    createStyles({
        buttonVerImagen: {
            '&:hover': {
                backgroundColor: COLOR_SECUDARIO,
                color: 'white',
            },

            backgroundColor: COLOR_PRIMARIO,
            color: 'white',
            margin: theme.spacing(2),
            fontWeight: 'bold',
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
    })
)

export const ButtonVerImage: React.FC<IProps> = ({ onclick }) => {
    const classes = useStyles()
    return (
        <Button
            className={classes.buttonVerImagen}
            startIcon={<VisibilityIcon />}
            onClick={onclick}
        >
            Ver
        </Button>
    )
}
