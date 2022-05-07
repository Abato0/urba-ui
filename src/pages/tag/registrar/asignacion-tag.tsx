import {} from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { IngresarTagForm } from '../../../components/tag/tag-form-ingresar'
import { IngresarTagVehiculoForm } from '../../../components/tag/tag-vehiculo-asignacion'

const TagIngresar = () => {
    return (
        <LayoutTituloPagina titulo="Tags - Asignación">
            <PermisoLayout
                tipoUsuarioRecibido={[TipoUsuario.ADMIN, TipoUsuario.OPERATIVO]}
            >
                <IngresarTagVehiculoForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default TagIngresar
