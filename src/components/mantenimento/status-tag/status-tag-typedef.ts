import { gql } from '@apollo/client'

export const listadoStatusTag = gql`
    query {
        ListaStatusTag {
            id
            statusTag
        }
    }
`

export const getStatusTag = gql`
    query ($id: Int!) {
        GetStatusTag(id: $id) {
            id
            statusTag
        }
    }
`

export const postStatusTag = gql`
    mutation ($statusTag: String) {
        PostStatusTag(statusTag: $statusTag) {
            code
            message
        }
    }
`

export const putStatusTag = gql`
    mutation ($id: Int!, $statusTag: String) {
        PutStatusTag(id: $id, statusTag: $statusTag) {
            code
            message
        }
    }
`

export const deleteStatusTag = gql`
    mutation ($id: Int!) {
        DeleteStatusTag(id: $id) {
            code
            message
        }
    }
`
