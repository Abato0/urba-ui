import { gql } from '@apollo/client'

export const listadoModeloMail = gql`
    query {
        ListaModeloMail {
            id
            categoria
            # titulo
            asunto
            textoSuperior
            textoInferior
            remitente
            firma
        }
    }
`

export const getModeloMail = gql`
    query ($id: Int!) {
        GetModeloMail(id: $id) {
            id
            categoria
            # titulo
            asunto
            textoSuperior
            textoInferior
            remitente
            firma
        }
    }
`

export const PutModeloMail = gql`
    mutation (
        $id: Int!
        # $titulo: String
        $asunto: String
        $textoSuperior: String
        $textoInferior: String
        $remitente: String
        $firma: String
    ) {
        PutModeloMail(
            id: $id
            input: {
                # titulo: $titulo
                asunto: $asunto
                textoSuperior: $textoSuperior
                textoInferior: $textoInferior
                remitente: $remitente
                firma: $firma
            }
        ) {
            code
            message
        }
    }
`
