import { gql, useMutation } from '@apollo/client'

export const saveGrupoFamiliar = gql`
    mutation (
        $id_calle_principal: Int
        # $id_usuario: Int
        $calle_interseccion: String
        $id_manzana: Int
        $nombre_familiar: String
        $villa: Int
        $extension: String
    ) {
        PostGrupoFamiliar(
            input: {
                id_calle_principal: $id_calle_principal
                calle_interseccion: $calle_interseccion
                # id_color_fachada: $id_color_fachada
                id_manzana: $id_manzana
                nombre_familiar: $nombre_familiar
                # id_tipo_edificacion: $id_tipo_edificacion
                villa: $villa
                extension: $extension
                # id_usuario: $id_usuario
            }
        ) {
            code
            message
        }
    }
`

export const updateGrupoFamiliarMutation = gql`
    mutation (
        $id: Int!
        $id_calle_principal: Int
        # $id_usuario: Int
        $calle_interseccion: String
        # $id_color_fachada: Int
        $id_manzana: Int
        $nombre_familiar: String
        # $id_tipo_edificacion: Int
        $villa: Int
        $extension: String
    ) {
        UpdateGrupoFamiliar(
            id: $id
            input: {
                id_calle_principal: $id_calle_principal
                calle_interseccion: $calle_interseccion
                # id_color_fachada: $id_color_fachada
                id_manzana: $id_manzana
                nombre_familiar: $nombre_familiar
                # id_tipo_edificacion: $id_tipo_edificacion
                villa: $villa
                extension: $extension
                # id_usuario: $id_usuario
            }
        ) {
            code
            message
        }
    }
`

export const deleteGrupoFamiliarMutation = gql`
    mutation ($id: Int!) {
        DeleteGrupoFamiliar(id: $id) {
            code
            message
        }
    }
`

export const listadoGrupoFamiliarSinUsuario = gql`
    query ListadoGruposFamiliaresSinUsuario {
        ListadoGruposFamiliaresSinUsuario {
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
    }
`

export const listadoGrupoFamiliar = gql`
    query AllGrupoFamiliar {
        ListaGruposFamiliares {
            id
            nombre_familiar
            manzana {
                id
                manzana
            }
            villa
            extension
            calle_principal {
                id
                calle
            }
            calle_interseccion
            # usuario {
            #     id
            # }
            # color_fachada {
            #   id
            #   color
            # }
            # tipo_edificacion {
            #   id
            #   tipo_edificacion
            # }
        }
    }
`

export const GetGrupoFamiliar = gql`
    query GrupoFamiliarOne($id: Int) {
        GetGrupoFamiliar(id: $id) {
            id
            nombre_familiar
            manzana {
                id
                manzana
            }
            villa
            extension
            calle_principal {
                id
                calle
            }
            calle_interseccion
            # usuario {
            #     id
            # }
            # color_fachada {
            #   id
            #   color
            # # }
            # tipo_edificacion {
            #   id
            #   tipo_edificacion
            # }
        }
    }
`

export const listarGruposFamiliaresFilter = gql`
    query GrupoFamiliarOne(
        # $calle_interseccion: String
        $calle_principal: String
        # $idGrupoFamiliar: Int
        $manzana: String
    ) {
        ListaGruposFamiliaresFilter(
            input: {
                # calle_interseccion: $calle_interseccion
                calle_principal: $calle_principal
                # idGrupoFamiliar: $idGrupoFamiliar
                manzana: $manzana
            }
        ) {
            id
            nombre_familiar
            manzana {
                id
                manzana
            }
            villa
            extension
            calle_principal {
                id
                calle
            }
            calle_interseccion
            # usuario {
            #     id
            # }
            # color_fachada {
            #   id
            #   color
            # # }
            # tipo_edificacion {
            #   id
            #   tipo_edificacion
            # }
        }
    }
`
