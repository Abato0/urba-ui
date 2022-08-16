import { useEffect, useState, useMemo, FC } from 'react'
import SideBar from './app-sidebar'
import {
    colors,
    createStyles,
    LinearProgress,
    makeStyles,
    Container,
} from '@material-ui/core'
import NavBar from './app-bar'
import { authMe, userRepresentante } from '../../auth/auth-service'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { TipoUsuario } from '../core/input/dateSelect'
import { equals } from 'ramda'
import { useSetRecoilState } from 'recoil'
import { userInfo } from '../../utils/states'
import {
    ItemUsuarioAdmin,
    newItemsListadoAdmin,
    newItemsListadoMorador,
    newItemsListadoOperador,
    newItemsManeniminetoOperador,
    newItemsMantenimientoAdmin,
    newItemsRegistrosADMIN,
    newItemsRegistrosMorador,
    newItemsRegistrosOperador,
    publicPages,
} from '../../utils/keys'
import { isNotEmpty } from '../../utils/is-nil-empty'
import {
    ItemsOperacionesAdmin,
    ItemOperacionesOperador,
    ItemsOperacionesMorador,
    ItemsListadoOperador,
    ItemsRegistrosOperador,
} from '../../utils/keys'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // display: 'flex',
            // flexDirection: 'row',
            // minWidth: 1000,
            // minHeight: '100vh',
            // width: "100%",
            //backgroundColor: "red"
            marginTop: theme.spacing(10),
        },
        componentRoot: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            // minHeight: 700,
            // minHeight:"100%",
            // minWidth: '400px',
            // background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
            backgroundColor: 'red',
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

    const [idUsuario, setIdUsuario] = useState<number>()
    const [flagMorador, seFlagMorador] = useState(false)

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
                    setIdUsuario(result.data.id)
                    setUsuarioState({
                        tipo_usuario: result.data.tipo,
                        user: result.data.usuario,
                        id: result.data.id,
                        apellidos: result.data.apellidos,
                        nombres: result.data.nombres,
                        num_identificacion: result.data.num_identificacion,
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

    const authMorador = async () => {
        try {
            if (idUsuario) {
                const result = await userRepresentante(idUsuario)
                console.log('Result: ', result)
                seFlagMorador(result.ok)
            }
        } catch (error) {
            console.log('Error: ', (error as Error).message)
            seFlagMorador(false)
        }
    }

    useEffect(() => {
        if (tipoUsuario === TipoUsuario.MORADOR && idUsuario) {
            authMorador()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idUsuario, tipoUsuario])

    const itemListadoFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? newItemsListadoAdmin
                : equals(tipoUsuario, TipoUsuario.OPERATIVO)
                ? newItemsListadoOperador
                : newItemsListadoMorador
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    const itemRegistroFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? newItemsRegistrosADMIN
                : equals(tipoUsuario, TipoUsuario.OPERATIVO)
                ? newItemsRegistrosOperador
                : equals(tipoUsuario, TipoUsuario.MORADOR) && flagMorador
                ? newItemsRegistrosMorador
                : []
        }
        return []
    }, [loading, authFlag, tipoUsuario, flagMorador])

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
                ? newItemsMantenimientoAdmin
                : equals(tipoUsuario, TipoUsuario.OPERATIVO)
                ? newItemsManeniminetoOperador
                : []
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    const itemsOperacionesFilter = useMemo(() => {
        if (!loading && authFlag && isNotEmpty(tipoUsuario)) {
            return equals(tipoUsuario, TipoUsuario.ADMIN)
                ? ItemsOperacionesAdmin
                : equals(tipoUsuario, TipoUsuario.OPERATIVO)
                ? ItemOperacionesOperador
                : ItemsOperacionesMorador
        }
        return []
    }, [loading, authFlag, tipoUsuario])

    return (
        <>
            {!loading && authFlag ? (
                <Container>
                    <NavBar />
                    <div className={classes.root}>
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                flexDirection: 'row',
                            }}
                        >
                            {/* <div style={{ display: "flex", width: "20%", flexDirection: "column" }}> */}
                            <SideBar
                                ItemsOperaciones={itemsOperacionesFilter}
                                ItemsListado={itemListadoFilter}
                                ItemsMantenimiento={itemManteniementoFilter}
                                ItemsRegistros={itemRegistroFilter}
                                ItemsUsuario={itemUsuarioFilter}
                            />
                            {/* </div> */}
                            {/* <div style={{ display: "flex", width: "80%", flexDirection: "column" }}> */}
                            {children}
                            {/* </div> */}
                        </div>
                    </div>
                </Container>
            ) : loading || authFlag === undefined ? (
                <>
                    <LinearProgress />
                </>
            ) : null}
        </>
    )
}

export default AppLayout
