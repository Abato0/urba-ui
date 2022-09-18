import {} from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarTagForm } from '../../../components/tag/tag-form-ingresar'

const TagIngresar = () => {
    return (
        <LayoutTituloPagina titulo="Tags - Registro">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}
            >
                <IngresarTagForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default TagIngresar
