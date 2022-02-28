import { gql } from "@apollo/client";

export const saveUsuario = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $imagen_perfil: Upload
    $password: String
    $tipo_usuario: String
    $user: String
  ) {
    PostUsuario(
      idGrupoFamiliar: $idGrupoFamiliar
      input: {
        imagen_perfil: $imagen_perfil
        password: $password
        tipo_usuario: $tipo_usuario
        user: $user
      }
    ) {
      code
      message
    }
  }
`;

export const updateUsuario = gql`
  mutation (
    $id: Int!
    $imagen_perfil: Upload
    $password: String
    $tipo_usuario: String
    $user: String
  ) {
    UpdatePago(
      id: $id
      input: {
        imagen_perfil: $imagen_perfil
        password: $password
        tipo_usuario: $tipo_usuario
        user: $String
      }
    ) {
      code
      message
    }
  }
`;

export const getUsuarioQuery = gql`
  query GetUsuarioQuery($id: Int) {
    GetUsuario(id: $id) {
      id
      imagen_perfil
      tipo_usuario
      user
      grupoFamiliar {
        nombre_familiar
      }
    }
  }
`;


