import {} from 'react'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarTipoEdificacionForm } from '../../../../components/mantenimento/tipo-edificacion/tipo-edificacion-form'

const MantenimientoTipoEdificacionRegistrar = () => {
    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarTipoEdificacionForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoTipoEdificacionRegistrar
