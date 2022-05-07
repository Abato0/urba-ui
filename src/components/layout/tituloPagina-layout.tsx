import {
    makeStyles,
    createStyles,
    colors,
    Typography,
    Box,
} from '@material-ui/core'

import { FC } from 'react'
import AppLayout from './app-layout'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            // minWidth: 1000,
            height: '100%',
        },
        componentRoot: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: 700,
            // minHeight:"100%",
            minWidth: '400px',
            background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
            borderRadius: '10px',
            alignContent: 'center',
            alignItems: 'center',
            margin: 10,
        },
        containerCard: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            margin: '20px',
            width: '100%',
            borderRadius: '10px',
        },
        cardTitle: {
            backgroundColor: 'white',
            width: '100%',
            paddingBottom: theme.spacing(3),
        },
        containerTitle: {
            // backgroundColor: "red",
            display: 'flex',
            justifyContent: 'center',
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1),
        },
        title: {
            fontSize: theme.typography.pxToRem(19),
            backgroundColor: colors.grey[200],
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
            borderRadius: 5,
            // fontWeight: "bold",
            // font
        },
    })
)

const LayoutTituloPagina: FC<{ titulo?: string }> = ({ titulo, children }) => {
    const classes = useStyles()
    return (
        <AppLayout>
            <Box className={classes.componentRoot}>
                {titulo && (
                    <div className={classes.cardTitle}>
                        <div className={classes.containerTitle}>
                            <Typography
                                variant="overline"
                                className={classes.title}
                            >
                                {titulo}
                            </Typography>
                        </div>
                    </div>
                )}
                <div className={classes.containerCard}>{children}</div>
            </Box>
        </AppLayout>
    )
}

export default LayoutTituloPagina
