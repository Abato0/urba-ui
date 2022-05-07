import { gql, useMutation } from '@apollo/client'

export const saveValorTagMutation = gql`
    mutation ($valor: Int, $tipo_tag: String) {
        PostValorTag(input: { valor: $valor, tipo_tag: $tipo_tag }) {
            code
            message
        }
    }
`

export const updateValorTagMutation = gql`
    mutation ($id: Int!, $valor: Int, $tipo_tag: String) {
        PutValorTag(id: $id, input: { valor: $valor, tipo_tag: $tipo_tag }) {
            code
            message
        }
    }
`

export const deleteValorTagMutation = gql`
    mutation ($id: Int!) {
        DeleteValorTag(id: $id) {
            code
            message
        }
    }
`

export const listadoValorTagQuery = gql`
    query ListaValorTag {
        ListaValorTag {
            id
            tipo_tag
            valor
        }
    }
`

export const getValorTagQuery = gql`
    query GetValorTag($id: Int) {
        GetValorTag(id: $id) {
            id
            tipo_tag
            valor
        }
    }
`
