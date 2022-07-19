//import { Box } from "mdi-material-ui"
import { Box } from "@material-ui/core"
import { useRouter } from "next/router"
import { useMemo } from "react"
import LayoutTituloPagina from "../../../components/layout/tituloPagina-layout"
import { useGetUsuario } from "../../../components/usuarios/use-usuario"
import { FormIngresarUsuario } from '../../../components/usuarios/form-ingresar-usuario';




const UsuarioEditar = () => {
    const router = useRouter()
    const id = useMemo(() => {
        return Number(router.query.id)
    }, [router.query.id])

    const { data: dataGetUsuario, loading: loadingGetUsuario } = useGetUsuario(id)


    const dataUsuario = useMemo(() => {
        if (!loadingGetUsuario && dataGetUsuario && dataGetUsuario.GetUsuario) {
            return dataGetUsuario.GetUsuario
        }

    }, [dataGetUsuario, loadingGetUsuario])


    return <LayoutTituloPagina titulo="Integrante Familiar -  Actualización">
        <Box>
            {dataUsuario && id &&
                <FormIngresarUsuario dataUsuario={dataUsuario} id={id} />}
        </Box>
    </LayoutTituloPagina>
}


export default UsuarioEditar