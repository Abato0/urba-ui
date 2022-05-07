import { gql } from '@apollo/client'

export const listadoTipoEdificacion = gql`
    query ListaTEdificacion {
        ListaTipoEdificacion {
            id
            tipo_edificacion
        }
    }
`

export const getTipoEdificacion = gql`
    query ($id: Int!) {
        GetTipoEdificacion(id: $id) {
            id
            tipo_edificacion
        }
    }
`

export const postTipoEdificacion = gql`
    mutation ($tipo_edificacion: String) {
        PostTipoEdificacion(tipo_edificacion: $tipo_edificacion) {
            code
            message
        }
    }
`

export const updateTipoEdificacion = gql`
    mutation ($id: Int!, $tipo_edificacion: String) {
        PutTipoEdificacion(id: $id, tipo_edificacion: $tipo_edificacion) {
            code
            message
        }
    }
`

export const deleteTipoEdicacion = gql`
    mutation ($id: Int!) {
        DeleteTipoEdificacion(id: $id) {
            code
            message
        }
    }
`
