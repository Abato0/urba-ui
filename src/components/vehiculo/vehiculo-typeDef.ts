import { gql } from '@apollo/client'

export const migracionVehiculo = gql`
    mutation ($file: Upload) {
        MigracionExcelVehiculo(excel: $file) {
            code
            message
        }
    }
`

export const eliminarVehiculo = gql`
    mutation ($id: Int!) {
        DeleteVehiculo(id: $id) {
            code
            message
        }
    }
`

export const saveVehiculo = gql`
    mutation (
        $idGrupoFamiliar: Int!
        $id_color: Int
        $id_marca: Int
        $matriculaFrontal: Upload
        $matriculaReverso: Upload
        $cedulaFrontal: Upload
        $cedulaReverso: Upload
        $id_modelo: Int
        # $id_status: Int
        $placa: String
        $num_doc_identidad: String
        $ano: Int
    ) {
        PostVehiculo(
            idGrupoFamiliar: $idGrupoFamiliar
            input: {
                ano: $ano
                placa: $placa
                id_marca: $id_marca
                id_color: $id_color
                id_modelo: $id_modelo
                # id_status: $id_status
                matriculaFrontal: $matriculaFrontal
                matriculaReverso: $matriculaReverso
                cedulaFrontal: $cedulaFrontal
                cedulaReverso: $cedulaReverso
                num_doc_identidad: $num_doc_identidad
            }
        ) {
            code
            message
        }
    }
`

export const listadoVehiculoFilter = gql`
    query VehiculosFilter(
        $idGrupoFamiliar: Int
        $marca: Int
        $modelo: Int # $status: String
    ) {
        ListaVehiculoFilter(
            input: {
                idGrupoFamiliar: $idGrupoFamiliar
                marca: $marca
                modelo: $modelo
                # status: $status
            }
        ) {
            id
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
                extension
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
            # status {
            #     statusVehiculo
            # }
            placa
            num_doc_identidad
            ano
            estadoAsingnacionTag
            # matriculaPdf
        }
    }
`

export const listadoVehiculo = gql`
    query AllVehiculos {
        ListaVehiculos {
            id
            grupoFamiliar {
                id
                nombre_familiar
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
            # status {
            #     statusVehiculo
            # }
            placa
            num_doc_identidad
            ano
            estadoAsingnacionTag
            # matriculaPdf
        }
    }
`

export const listadoVehiculoInactivos = gql`
    query AllVehiculosInactivos {
        ListaVehiculosInactivos {
            id
            grupoFamiliar {
                id
                nombre_familiar
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
            ano
            # status {
            #     #     statusVehiculo
            #     # }
            #     placa
            #     num_doc_identidad
            #     # matriculaPdf
            # }
        }
    }
`

export const getVehiculo = gql`
    query GetVehiculo($id: Int!) {
        GetVehiculos(id: $id) {
            id
            grupoFamiliar {
                id
                nombre_familiar
            }
            modelo {
                id
                modelo
            }
            marca {
                id
                marca
            }
            color {
                id
                color
            }
            # status {
            #     id
            #     statusVehiculo
            # }
            placa
            matriculaFrontal
            matriculaReverso
            cedulaFrontal
            num_doc_identidad
            cedulaReverso
            ano
        }
    }
`

export const updateVehiculo = gql`
    mutation (
        $id: Int!
        $id_color: Int
        $id_marca: Int
        $matriculaFrontal: Upload
        $matriculaReverso: Upload
        $cedulaFrontal: Upload
        $cedulaReverso: Upload
        $id_modelo: Int
        # $id_status: Int
        $placa: String
        $num_doc_identidad: String
        $ano: Int
    ) {
        UpdateVehiculo(
            id: $id
            input: {
                ano: $ano
                placa: $placa
                id_marca: $id_marca
                id_color: $id_color
                id_modelo: $id_modelo
                # id_status: $id_status
                matriculaFrontal: $matriculaFrontal
                matriculaReverso: $matriculaReverso
                cedulaFrontal: $cedulaFrontal
                cedulaReverso: $cedulaReverso
                num_doc_identidad: $num_doc_identidad
            }
        ) {
            code
            message
        }
    }
`

export const inactivarVehiculos = gql`
    mutation ($id: String) {
        InactivarVehiculos(id: $id) {
            code
            message
        }
    }
`

export const activarVehiculos = gql`
    mutation ($id: String) {
        ActivarVehiculos(id: $id) {
            code
            message
        }
    }
`
