import { gql } from '@apollo/client'

export const migracionManzanas = gql`
    mutation ($file: Upload) {
        MigracionExcelManzana(excel: $file) {
            code
            message
        }
    }
`

export const listadoMazanas = gql`
    query ListaManzanas {
        ListaManzana {
            id
            manzana
        }
    }
`

export const getManzana = gql`
    query ($id: Int!) {
        GetManzana(id: $id) {
            id
            manzana
        }
    }
`

export const postManzana = gql`
    mutation ($manzana: String) {
        PostManzana(manzana: $manzana) {
            code
            message
        }
    }
`

export const updateManzana = gql`
    mutation ($id: Int!, $manzana: String) {
        PutManzana(id: $id, manzana: $manzana) {
            code
            message
        }
    }
`

export const deleteManzana = gql`
    mutation ($id: Int!) {
        DeleteManzana(id: $id) {
            code
            message
        }
    }
`
