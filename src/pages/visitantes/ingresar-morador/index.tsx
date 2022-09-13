import React from 'react'
import { TipoUsuario } from '../../../components/core/input/dateSelect'
import PermisoLayout from '../../../components/layout/auth-layout/permiso-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { FormIngresarMorador } from '../../../components/visitante/form-ingresar-morador'

const IngresarVisitanteMorador = () => {
    return (
        <LayoutTituloPagina titulo="Visitante - REGISTRO">
            <PermisoLayout
                tipoUsuarioRecibido={[
                    TipoUsuario.ADMIN,
                    TipoUsuario.OPERATIVO,
                    TipoUsuario.MORADOR,
                ]}
            >
                <FormIngresarMorador />
            </PermisoLayout>
        </LayoutTituloPagina>
    )
}

export default IngresarVisitanteMorador
