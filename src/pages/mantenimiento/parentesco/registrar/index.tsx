import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import NavBar from '../../../../components/layout/app-bar'
import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarParentescoForm } from '../../../../components/mantenimento/parentesco/parentesco-form'

const MantenimientoParentescoIngresar = () => {
    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarParentescoForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoParentescoIngresar
