import { FC } from 'react'
import AppLayout from '../../../components/layout/app-layout'

import { saveGrupoFamiliar } from '../../../components/grupo-familiar/grupo-familiar-typeDefs'

import GrupoFamiliarFormRegistro from '../../../components/grupo-familiar/grupo-familiar-form-registro'
import LayoutTituloPagina from '../../../components/layout/tituloPagina-layout'

const RegisterGrupoFamiliar = () => {
    return (
        <LayoutTituloPagina titulo="Grupo Familiar - Registro">
            <GrupoFamiliarFormRegistro mutation={saveGrupoFamiliar} />
        </LayoutTituloPagina>
    )
}

export default RegisterGrupoFamiliar
