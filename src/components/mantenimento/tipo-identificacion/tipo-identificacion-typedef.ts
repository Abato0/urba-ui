import { gql } from '@apollo/client'

export const migracionipoIdentificacion = gql`
    mutation ($file: Upload) {
        MigracionExcelTipoIdentificacion(excel: $file) {
            code
            message
        }
    }
`

export const listadoTipoIdentificacion = gql`
    query {
        ListaTipoIdentificacion {
            id
            tipo_identificacion
        }
    }
`

export const getTipoIdentificacion = gql`
    query ($id: Int!) {
        GetTipoIdentificacion(id: $id) {
            id
            tipo_identificacion
        }
    }
`

export const postTipoIdentificacion = gql`
    mutation ($tipo_identificacion: String) {
        PostTipoIdentificacion(tipo_identificacion: $tipo_identificacion) {
            code
            message
        }
    }
`

export const updateTipoIdentificacion = gql`
    mutation ($id: Int!, $tipo_identificacion: String) {
        PutTipoIdentificacion(
            id: $id
            tipo_identificacion: $tipo_identificacion
        ) {
            code
            message
        }
    }
`

export const deleteTipoIdentificacion = gql`
    mutation ($id: Int!) {
        DeleteTipoIdentificacion(id: $id) {
            code
            message
        }
    }
`
