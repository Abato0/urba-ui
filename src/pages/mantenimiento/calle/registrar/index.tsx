import { IngresarCalleForm } from '../../../../components/mantenimento/calle/calle-form'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'

const MantenimientoCalleIngresar = () => {
    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarCalleForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoCalleIngresar
