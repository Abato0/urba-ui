import {} from 'react'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import NavBar from '../../../../components/layout/app-bar'

import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarModeloForm } from '../../../../components/mantenimento/modelo/modelo-form'

const MantenimientoModeloIngresar = () => {
    return (
        <LayoutTituloPagina titulo="Cambio de Contraseña">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarModeloForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoModeloIngresar
