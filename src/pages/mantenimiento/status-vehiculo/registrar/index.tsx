import {} from 'react'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import NavBar from '../../../../components/layout/app-bar'

import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarStatusVehiculoForm } from '../../../../components/mantenimento/status-vehiculo/status-vehiculo-form'

const MantenimientoStatusVehiculoIngresar = () => {
    return (
        <LayoutTituloPagina>
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarStatusVehiculoForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoStatusVehiculoIngresar
