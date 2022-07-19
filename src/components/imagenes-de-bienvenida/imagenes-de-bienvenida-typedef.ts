import { gql } from '@apollo/client'

export const listadoImagenesBienvenida = gql`
    query ListaImagenesSitio {
        ListaImagenesSitio {
            id
            nombre
            urlImagen
            lugar
        }
    }
`

export const postImagenBienvenida = gql`
    mutation ($imagen: Upload, $nombre: String!, $lugar: String!) {
        PostImagenSitio(
            input: { imagen: $imagen, nombre: $nombre, lugar: $lugar }
        ) {
            code
            message
        }
    }
`

export const deleteImageBienvenida = gql`
    mutation ($id: Int!) {
        DeleteImagenSitio(id: $id) {
            code
            message
        }
    }
`
