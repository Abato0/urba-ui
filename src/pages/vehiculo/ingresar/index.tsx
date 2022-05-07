import React from 'react'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import FormIngresarVehiculos from '../../../components/vehiculo/vehiculo-form'

const IngresarVehiculo = () => {
    return (
        <LayoutTituloPagina titulo="Registro de Vehiculo">
            <FormIngresarVehiculos />
        </LayoutTituloPagina>
    )
}

export default IngresarVehiculo
