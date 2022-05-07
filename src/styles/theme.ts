import { colors } from '@material-ui/core'
import { common } from '@material-ui/core/colors'
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { join } from 'ramda'

/**
 * @function
 */
const joinWithComma = join(',')

const theme = createTheme({
    typography: {
        fontFamily: joinWithComma([
            'Poppins',
            'Helvetica',
            'Arial',
            'sans-serif',
        ]),
    },
    palette: {
        success: {
            main: '#00e089',
        },
        warning: {
            main: '#ffae00',
        },
        error: {
            main: '#d91073',
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.7)',
        },
        primary: {
            main: '#212121',
            light: '#5a6269',
            dark: '#0a1218',
            contrastText: common.white,
        },
        secondary: {
            main: '#0093e0',
            light: '#61c3ff',
            dark: '#0066ae',
            contrastText: common.black,
        },
        background: {
            default: '#f5f5f5',
        },
    },
    props: {
        MuiButton: {
            // Make button variant `contained` by default
            variant: 'contained',
        },
        MuiTextField: {
            variant: 'outlined',
        },
    },
})

export default createTheme(
    {
        overrides: {
            MuiButton: {
                root: {
                    boxShadow: 'none',
                    FontWeight: theme.typography.fontWeightBold,
                    borderRadius: '12px',
                    fontSize: theme.typography.caption.fontSize,
                    '&$disabled': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                },
                containedPrimary: {
                    border: theme.palette.primary.main,
                    '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        boxShadow: 'none',
                    },
                    '&:focus': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: 'none',
                    },
                    '&$disabled': {
                        borderColor: theme.palette.action.disabled,
                    },
                },
                containedSecondary: {
                    color: theme.palette.common.white,
                    borderColor: theme.palette.secondary.main,
                    '&:hover': {
                        borderColor: theme.palette.secondary.dark,
                        boxShadow: 'none',
                    },
                    '&:focus': {
                        borderColor: theme.palette.secondary.main,
                        boxShadow: 'none',
                    },
                },
            },
            MuiFormControl: {
                // Always give room for form helper text so we don't break
                // the layout on error state
                root: {
                    minHeight: '4.8rem',
                },
                marginDense: {
                    minHeight: '3.8rem',
                },
            },
            MuiOutlinedInput: {
                root: {
                    borderColor: `${colors.deepPurple[300]}`,
                    // "&:hover $notchedOutline $cssFocused": {
                    //   borderColor: `${colors.deepPurple[600]}`,
                    // },
                },
            },
        },
    },
    responsiveFontSizes(theme)
)
