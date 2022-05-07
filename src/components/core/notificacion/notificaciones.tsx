import { makeStyles, Theme, createStyles, List } from '@material-ui/core'

import React from 'react'
import ListItemNotificacion from './list-item'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
        },
        listSection: {
            backgroundColor: 'inherit',
        },
        ul: {
            backgroundColor: 'inherit',
            padding: 0,
        },
    })
)

interface INotificacion {
    id: number
    titulo: string
    mensaje: string
    estado: string
}

const Notificaciones = () => {
    const classes = useStyles()
    return (
        <List className={classes.root}>
            <ListItemNotificacion />
            <ListItemNotificacion />
            <ListItemNotificacion />
            <ListItemNotificacion />
        </List>
    )
}

export default Notificaciones
