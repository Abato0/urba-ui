import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    colors,
    createStyles,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { COLOR_PRIMARIO } from '../../../utils/keys'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 'bold',
            color: colors.deepPurple[900],
        },
        trNode: {
            '&:hover': {
                background: colors.blueGrey[50],
            },
            width: '100%',
            height: '100%',
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        icon: {
            // // marginTop: 8,
            marginRight: 10,
            marginLeft: 8,
            maxHeight: 16,
            color: colors.deepPurple[900],
        },
    })
)

interface IProps {
    label: string
    icon?: any
    selected?: boolean
    elevation?: number
}

const AcordionHeader: React.FC<IProps> = ({
    label,
    children,
    icon,
    selected = false,
    elevation = 2,
}) => {
    const classes = useStyles()
    return (
        <Accordion
            elevation={elevation}
            style={{ backgroundColor: selected ? COLOR_PRIMARIO : 'white' }}
        >
            <AccordionSummary
                expandIcon={
                    <ExpandMoreIcon
                        className={classes.icon}
                        style={{
                            color: selected ? colors.deepPurple[900] : 'white',
                        }}
                    />
                }
            >
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={3}>
                        {icon && (
                            <FontAwesomeIcon
                                icon={icon}
                                className={classes.icon}
                                style={{
                                    color: selected
                                        ? 'white'
                                        : colors.deepPurple[900],
                                }}
                            />
                        )}
                    </Grid>
                    <Grid item xs={9}>
                        <Typography
                            className={classes.heading}
                            style={{
                                color: selected
                                    ? 'white'
                                    : colors.deepPurple[900],
                            }}
                        >
                            {label}
                        </Typography>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <div className={classes.container}>{children}</div>
            </AccordionDetails>
        </Accordion>
    )
}

export default AcordionHeader
