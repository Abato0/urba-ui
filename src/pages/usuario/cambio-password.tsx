import NavBar from '../../components/layout/app-bar'
import AppLayout from '../../components/layout/app-layout'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { CambiarContrasenaUsuarioForm } from '../../components/usuarios/cambiar-contrasena-form'

const CambioContreasenaUsuario = () => {
    return (
        <LayoutTituloPagina titulo="Cambio de Contraseña">
            <CambiarContrasenaUsuarioForm />
        </LayoutTituloPagina>
    )
}

export default CambioContreasenaUsuario
