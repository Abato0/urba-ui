import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarManzanaForm } from '../../../../components/mantenimento/manzana/manzana-form'

const MantenimientoManzanaIngresar = () => {
    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarManzanaForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoManzanaIngresar
