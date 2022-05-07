import {} from 'react'
import NavBar from '../../../../components/layout/app-bar'
import AppLayout from '../../../../components/layout/app-layout'
import LayoutTituloPagina from '../../../../components/layout/tituloPagina-layout'
import { IngresarValorTagForm } from '../../../../components/mantenimento/valor-tag/valor-tag-form'

const MantenimientoValorTagRegistrar = () => {
    return (
        <LayoutTituloPagina>
            <IngresarValorTagForm />
        </LayoutTituloPagina>
    )
}

export default MantenimientoValorTagRegistrar
