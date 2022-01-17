import { gql } from "@apollo/client";

export const saveIntegrante = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $apellido: String
    $cedula: String
    $fecha_nacimiento: String
    $nombre: String
    $parentesco: String
    $telefono: String
  ) {
    PostIntegrante(
      idGrupoFamiliar: $idGrupoFamiliar
      input: {
        apellido: $apellido
        cedula: $cedula
        fecha_nacimiento: $fecha_nacimiento
        nombre: $nombre
        parentesco: $parentesco
        telefono: $telefono
      }
    ) {
      code
      message
    }
  }
`;

export const listadoIntegranteGrupoFamiliar = gql`
  query ($idGrupoFamiliar: Int!) {
    ListaIntegrantesGrupoFamiliar(idGrupoFamiliar: $idGrupoFamiliar) {
      id
      cedula
      nombre
      apellido
      fecha_nacimiento
      grupoFamiliar {
        id
        nombre_familiar
        manzana
        villa
        calle
      }
      parentesco
      telefono
    }
  }
`;

export const listadoIntegrante = gql`
  query {
    ListaIntegrantes {
      id
      cedula
      nombre
      apellido
      fecha_nacimiento
      grupoFamiliar {
        id
        nombre_familiar
        manzana
        villa
        calle
      }
      parentesco
      telefono
    }
  }
`;

export const getIntegrante = gql`
  query ($id: Int!) {
    GetIntegrante(id: $id) {
      id
      cedula
      nombre
      apellido
      fecha_nacimiento
      grupoFamiliar {
        id
        nombre_familiar
        manzana
        villa
        calle
      }
      parentesco
      telefono
    }
  }
`;

export const updateIntegrante = gql`
  mutation (
    $id: Int!
    $apellido: String
    $cedula: String
    $fecha_nacimiento: String
    $nombre: String
    $parentesco: String
    $telefono: String
  ) {
    UpdateIntegrante(
      id: $id
      input: {
        apellido: $apellido
        cedula: $cedula
        fecha_nacimiento: $fecha_nacimiento
        nombre: $nombre
        parentesco: $parentesco
        telefono: $telefono
      }
    ) {
      code
      message
    }
  }
`;
