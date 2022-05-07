import { gql } from '@apollo/client'

export const listadoParentesco = gql`
    query {
        ListaParentesco {
            id
            parentesco
        }
    }
`

export const getParentesco = gql`
    query ($id: Int!) {
        GetParentesco(id: $id) {
            id
            parentesco
        }
    }
`

export const postParentesco = gql`
    mutation ($parentesco: String) {
        PostParentesco(parentesco: $parentesco) {
            code
            message
        }
    }
`

export const updateParentesco = gql`
    mutation ($id: Int!, $parentesco: String) {
        PutParentesco(id: $id, parentesco: $parentesco) {
            code
            message
        }
    }
`

export const deleteParentesco = gql`
    mutation ($id: Int!) {
        DeleteParentesco(id: $id) {
            code
            message
        }
    }
`
