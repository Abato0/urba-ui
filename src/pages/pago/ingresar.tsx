import React from 'react'
import NavBar from '../../components/layout/app-bar'
import AppLayout from '../../components/layout/app-layout'
import LayoutTituloPagina from '../../components/layout/tituloPagina-layout'
import { PagoFormMulti } from '../../components/pago/pago.form-multi'

export const IngresarPago = () => {
    return (
        <LayoutTituloPagina titulo="Pago - REGISTRO">
            <PagoFormMulti />
        </LayoutTituloPagina>
    )
}

export default IngresarPago
