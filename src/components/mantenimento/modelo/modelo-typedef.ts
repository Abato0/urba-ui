import { gql } from '@apollo/client'

export const listadoModelo = gql`
    query {
        ListaModelo {
            id
            modelo
        }
    }
`

export const getModelo = gql`
    query ($id: Int!) {
        GetModelo(id: $id) {
            id
            modelo
        }
    }
`

export const postModelo = gql`
    mutation ($modelo: String) {
        PostModelo(modelo: $modelo) {
            code
            message
        }
    }
`

export const updateModelo = gql`
    mutation ($id: Int!, $modelo: String) {
        PutModelo(id: $id, modelo: $modelo) {
            code
            message
        }
    }
`

export const deleteModelo = gql`
    mutation ($id: Int!) {
        DeleteModelo(id: $id) {
            code
            message
        }
    }
`
