import { gql } from '@apollo/client'

export const saveVisitanteMorador = gql`
    mutation (
        $idGrupoFamiliar: Int
        $nombre_visitante: String
        $descripcion: String
        $fecha_visita: String
    ) {
        PostVisitanteMorador(
            input: {
                idGrupoFamiliar: $idGrupoFamiliar
                nombre_visitante: $nombre_visitante
                descripcion: $descripcion
                fecha_visita: $fecha_visita
            }
        ) {
            code
            message
        }
    }
`
export const updateVisitanteMorador = gql`
    mutation (
        $id: Int!
        $idGrupoFamiliar: Int
        $nombre_visitante: String
        $descripcion: String
        $fecha_visita: String
    ) {
        PutVisitanteMorador(
            id: $id
            input: {
                idGrupoFamiliar: $idGrupoFamiliar
                nombre_visitante: $nombre_visitante
                descripcion: $descripcion
                fecha_visita: $fecha_visita
            }
        ) {
            code
            message
        }
    }
`
export const postLlegadaVisitante = gql`
    mutation (
        $id: Int!
        $identificacion_visitante: String
        $placa_vehiculo: String
    ) {
        LLegadaVisitante(
            id: $id
            input: {
                identificacion_visitante: $identificacion_visitante
                placa_vehiculo: $placa_vehiculo
            }
        ) {
            code
            message
        }
    }
`

export const putLlegadoVisiante = gql`
    mutation (
        $id: Int!
        $identificacion_visitante: String
        $placa_vehiculo: String
    ) {
        UpdateLLegadaVisitante(
            id: $id
            input: {
                identificacion_visitante: $identificacion_visitante
                placa_vehiculo: $placa_vehiculo
            }
        ) {
            code
            message
        }
    }
`

export const deleteVisitante = gql`
    mutation ($id: Int!) {
        DeleteVisitante(id: $id) {
            code
            message
        }
    }
`

export const salidaVisitante = gql`
    mutation ($id: Int!) {
        SalidaVisitante(id: $id) {
            code
            message
        }
    }
`
export const listadoVisitanteMorador = gql`
    query allListadoVisitanteMorador {
        ListadoVisitante {
            id
            nombre_visitante
            descripcion
            fecha_visita
            grupoFamiliar {
                id
                nombre_familiar
                calle_interseccion
                calle_principal {
                    calle
                }
                villa
                manzana {
                    manzana
                }
                extension
            }
        }
    }
`

export const getVisitanteMorador = gql`
    query GetVisitanteMorador($id: Int!) {
        GetVisitante(id: $id) {
            id
            nombre_visitante
            descripcion
            fecha_visita
            grupoFamiliar {
                id
                nombre_familiar
                calle_interseccion
                calle_principal {
                    calle
                }
                villa
                manzana {
                    manzana
                }
                extension
            }
        }
    }
`

export const listadoVisitante = gql`
    query allLisadoVisitante {
        ListadoVisitante {
            id
            identificacion_visitante
            placa_vehiculo
            nombre_visitante
            descripcion
            fecha_visita
            fecha_llegada
            grupoFamiliar {
                id
                nombre_familiar
                calle_interseccion
                calle_principal {
                    calle
                }
                villa
                manzana {
                    manzana
                }
                extension
            }
        }
    }
`

export const getVisitante = gql`
    query GetVisitante($id: Int!) {
        GetVisitante(id: $id) {
            id
            identificacion_visitante
            placa_vehiculo
            nombre_visitante
            descripcion
            fecha_visita
            fecha_llegada
            grupoFamiliar {
                id
                nombre_familiar
                calle_interseccion
                calle_principal {
                    calle
                }
                villa
                manzana {
                    manzana
                }
                extension
            }
        }
    }
`
