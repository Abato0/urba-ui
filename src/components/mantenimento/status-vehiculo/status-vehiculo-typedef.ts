import { gql } from '@apollo/client'

export const migracionStatusVehiculo = gql`
    mutation ($file: Upload) {
        MigracionExcelStatusVehiculo(excel: $file) {
            code
            message
        }
    }
`

export const listadoStatusVehiculo = gql`
    query {
        ListaStatusVehiculo {
            id
            statusVehiculo
        }
    }
`

export const getStatusVehiculo = gql`
    query ($id: Int!) {
        GetStatusVehiculo(id: $id) {
            id
            statusVehiculo
        }
    }
`

export const postStatusVehiculo = gql`
    mutation ($statusVehiculo: String) {
        PostStatusVehiculo(statusVehiculo: $statusVehiculo) {
            code
            message
        }
    }
`

export const updateStatusVehiculo = gql`
    mutation ($id: Int!, $statusVehiculo: String) {
        PutStatusVehiculo(id: $id, statusVehiculo: $statusVehiculo) {
            code
            message
        }
    }
`

export const deleteStatusVehiculo = gql`
    mutation ($id: Int!) {
        DeleteStatusVehiculo(id: $id) {
            code
            message
        }
    }
`
