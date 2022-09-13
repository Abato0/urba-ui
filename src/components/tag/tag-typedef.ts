import { gql } from '@apollo/client'

export const listadoTagPagos = gql`
    query {
        ListaTagPago {
            id
            valorTag {
                id
                tipo_tag
                valor
            }
            fecha_pago
            monto

            vehiculo {
                id
                placa
                grupoFamiliar {
                    id
                    nombre_familiar
                }
            }
        }
    }
`

export const listaTagVehiculo = gql`
    query {
        ListaTagVehiculo {
            id
            tag {
                id
                code
            }
            vehiculo {
                id
                placa
                grupoFamiliar {
                    id
                    nombre_familiar
                    manzana {
                        id
                        manzana
                    }
                    villa
                    calle_principal {
                        id
                        calle
                    }
                    calle_interseccion
                }
                modelo {
                    modelo
                }
                marca {
                    marca
                }
                color {
                    color
                }
            }
        }
    }
`

export const postTagVehiculo = gql`
    mutation ($idVehiculo: Int, $idTag: Int) {
        PostTagVehiculo(input: { idVehiculo: $idVehiculo, idTag: $idTag }) {
            code
            message
        }
    }
`

export const deleteTagVehiculo = gql`
    mutation ($id: Int!) {
        DeleteTagPagoVehiculo(id: $id) {
            code
            message
        }
    }
`

export const listadoTags = gql`
    query {
        ListaTag {
            id
            code
            estado
        }
    }
`

export const listadoAllTags = gql`
    query {
        ListaTagAll {
            id
            code
            estado
        }
    }
`

export const getTag = gql`
    query GetTag($id: Int!) {
        GetTag(id: $id) {
            id
            code
            estado
        }
    }
`

export const postTag = gql`
    mutation ($code: String, $idStatus: Int) {
        PostTag(code: $code, idStatus: $idStatus) {
            code
            message
        }
    }
`

export const putTag = gql`
    mutation ($id: Int!, $code: String, $idStatus: Int) {
        PutTag(id: $id, code: $code, idStatus: $idStatus) {
            code
            message
        }
    }
`

export const cambiarEstadoTag = gql`
    mutation ($id: Int!, $estado: String) {
        CambiarEstadoTag(id: $id, estado: $estado) {
            code
            message
        }
    }
`

export const deleteTag = gql`
    mutation ($id: Int!) {
        DeleteTag(id: $id) {
            code
            message
        }
    }
`

// export const getColor = gql`
//   query ($id: Int!) {
//     GetColor(id: $id) {
//       id
//       color
//     }
//   }
// `;
