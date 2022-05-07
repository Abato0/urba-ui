import {} from 'react'
import IntegranteFormIngresar from '../../../components/integrante/integrante-form-registro'
import NavBar from '../../../components/layout/app-bar'
import AppLayout from '../../../components/layout/app-layout'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'

const IntegranteIngresar = () => {
    return (
        <LayoutTituloPagina titulo=" Integrante Familiar - Registro">
            <IntegranteFormIngresar />
        </LayoutTituloPagina>
    )
}

export default IntegranteIngresar
