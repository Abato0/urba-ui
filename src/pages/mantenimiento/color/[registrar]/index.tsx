import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarColorForm } from '../../../../components/mantenimento/color/color-form'

const MantenimientoColorIngresar = () => {
    return (
        <LayoutTituloPagina titulo="Cambio de Contraseña">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarColorForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoColorIngresar
