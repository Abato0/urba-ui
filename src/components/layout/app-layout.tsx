import { useEffect, useState, useMemo, FC } from 'react'
import SideBar from './app-sidebar'
import {
    colors,
    createStyles,
    LinearProgress,
    makeStyles,
} from '@material-ui/core'
import NavBar from './app-bar'
import { authMe } from '../../auth/auth-service'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { TipoUsuario } from '../core/input/dateSelect'
import { equals } from 'ramda'
import { useSetRecoilState } from 'recoil'
import { userInfo } from '../../utils/states'
import {
    ItemsListadoAdmin,
    ItemsListadoMorador,
    ItemsMantenimientoAdmin,
    ItemsRegistrosADMIN,
    ItemsRegistrosMorador,
    ItemUsuarioAdmin,
    publicPages,
} from '../../utils/keys'
import { isNotEmpty } from '../../utils/is-nil-empty'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            minWidth: 1000,
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

interface IProps {
    className?: string
    titulo?: string
}
const AppLayout: FC<IProps> = ({ children, className, titulo }) => {
    const classes = useStyles()
    const router = useRouter()
    const [authFlag, setAuthFlag] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(false)
    const [tipoUsuario, setTipoUsuario] = useState('')

    const setUsuarioState = useSetRecoilState(userInfo)

    const paht = useMemo(() => {
        return publicPages.includes(router.pathname)
    }, [router.pathname])

    const autho = async () => {
        try {
            const token = Cookies.get('token')
            if (token) {
                setLoading(true)
                const result = await authMe(token)
                console.log('tipoUsuario', result)
                if (result && result.code === 200) {
                    setAuthFlag(true)
                    setTipoUsuario(result.data.tipo)
                    setUsuarioState({
                        tipo_usuario: result.data.tipo,
                        user: result.data.usuario,
                    })
                }
                setLoading(false)
            } else {
                setAuthFlag(false)
                await redirectLogin()
            }
        } catch (error) {
            setAuthFlag(false)
            setLoading(false)
            await redirectLogin()
            console.log('error: ', (error as Error).message)
        }
    }

    const redirectLogin = async () => {
        return await router.push('/login')
    }

    useEffect(() => {
        autho()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const itemListadoFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? ItemsListadoAdmin
                : ItemsListadoMorador
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    const itemRegistroFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? ItemsRegistrosADMIN
                : ItemsRegistrosMorador
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    const itemUsuarioFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? ItemUsuarioAdmin
                : []
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    const itemManteniementoFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? ItemsMantenimientoAdmin
                : []
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    return (
        <>
            {!loading && authFlag ? (
                <>
                    <NavBar />
                    <div className={classes.root}>
                        <SideBar
                            ItemsListado={itemListadoFilter}
                            ItemsMantenimiento={itemManteniementoFilter}
                            ItemsRegistros={itemRegistroFilter}
                            ItemsUsuario={itemUsuarioFilter}
                        />
                        {children}
                    </div>
                </>
            ) : loading || authFlag === undefined ? (
                <>
                    <LinearProgress />
                </>
            ) : null}
        </>
    )
}

export default AppLayout
