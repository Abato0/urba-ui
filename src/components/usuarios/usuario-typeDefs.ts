import { gql } from "@apollo/client";

export const envioCorreos = gql`
  mutation (
    $emails: [String]
    $titulo: String
    $asunto: String
    $mensaje: String
  ) {
    EnvioCorreo(
      input: {
        emails: $emails
        titulo: $titulo
        asunto: $asunto
        mensaje: $mensaje
      }
    ) {
      code
      message
    }
  }
`;

export const saveUsuario = gql`
  mutation (
    $tipo_usuario: String
    $imagen_perfil: Upload
    $num_identificacion: String
    $nombres: String
    $apellidos: String
    $email: String
    $telefono: String
    $idTipoIdentificacion: Int
  ) {
    PostUsuario(
      input: {
        tipo_usuario: $tipo_usuario
        imagen_perfil: $imagen_perfil
        num_identificacion: $num_identificacion
        nombres: $nombres
        apellidos: $apellidos
        email: $email
        telefono: $telefono
        idTipoIdentificacion: $idTipoIdentificacion
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
    $tipo_usuario: String
    $imagen_perfil: Upload
    $num_identificacion: String
    $nombres: String
    $apellidos: String
    $email: String
    $telefono: String
    $idTipoIdentificacion: Int
  ) {
    UpdatePago(
      id: $id
      input: {
        tipo_usuario: $tipo_usuario
        imagen_perfil: $imagen_perfil
        num_identificacion: $num_identificacion
        nombres: $nombres
        apellidos: $apellidos
        email: $email
        telefono: $telefono
        idTipoIdentificacion: $idTipoIdentificacion
      }
    ) {
      code
      message
    }
  }
`;

export const deleteUsuario = gql`
  mutation ($id: Int!) {
    DeleteUsuario(id: $id) {
      code
      message
    }
  }
`;

export const listadoUsuarios = gql`
  query {
    ListaUsuario {
      id
      user
      tipo_usuario
      imagen_perfil
      num_identificacion
      nombres
      apellidos
      email
      telefono
      tipoIdentificacion {
        id
        tipo_identificacion
      }
    }
  }
`;

export const getUsuarioTokenQuery = gql`
  query GetUsuarioQueryToken($id: Int) {
    GetUsuarioToken(id: $id) {
      id
      user
      tipo_usuario
      imagen_perfil
      num_identificacion
      nombres
      apellidos
      email
      telefono
      tipoIdentificacion {
        id
        tipo_identificacion
      }
    }
  }
`;

export const getUsuarioQuery = gql`
  query GetUsuarioQuery($id: Int) {
    GetUsuario(id: $id) {
      id
      user
      # password: String
      tipo_usuario
      imagen_perfil
      # grupoFamiliar: GrupoFamiliar
      num_identificacion
      nombres
      apellidos
      email
      telefono
      tipoIdentificacion {
        id
        tipo_identificacion
      }
    }
  }
`;

export const cambioContrasena = gql`
  mutation ($password: String, $newPassword: String) {
    CambioContrasena(
      input: { password: $password, newPassword: $newPassword }
    ) {
      code
      message
    }
  }
`;

export const contrasenaOlvidada = gql`
  mutation (
    $usuario: String
    $newPassword: String
    $num_identificacion: String
  ) {
    CambioContrasena(
      usuario: $usuario
      newPassword: $newPassword
      num_identificacion: $num_identificacion
    ) {
      code
      message
    }
  }
`;
