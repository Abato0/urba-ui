import {} from 'react'
import { TipoUsuario } from '../../../../components/core/input/dateSelect'
import NavBar from '../../../../components/layout/app-bar'

import AppLayout from '../../../../components/layout/app-layout'
import PermisoLayout from '../../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarManzanaForm } from '../../../../components/mantenimento/manzana/manzana-form'
import { IngresarMarcaForm } from '../../../../components/mantenimento/marca/marca-form'

const MantenimientoMarcaIngresar = () => {
    return (
        <LayoutTituloPagina titulo="Cambio de Contraseña">
            <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
                <IngresarMarcaForm />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default MantenimientoMarcaIngresar
