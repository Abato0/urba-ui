import React from 'react'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'
import { FormIngresarMorador } from '../../../components/visitante/form-ingresar-morador'

const IngresarVisitanteMorador = () => {
    return (
        <LayoutTituloPagina titulo="Visitante - REGISTRO">
            <FormIngresarMorador />
        </LayoutTituloPagina>
    )
}

export default IngresarVisitanteMorador
