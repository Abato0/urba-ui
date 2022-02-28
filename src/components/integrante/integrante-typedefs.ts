import { gql } from "@apollo/client";

export const saveIntegrante = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $apellido: String
    $email: String
    $fecha_nacimiento: String
    $genero: String
    $id_parentesco: Int
    $nombre: String
    $num_doc_identidad: String
    $representante: String
    $telefono: String
    $tipo_doc_identidad: String
  ) {
    PostIntegrante(
      idGrupoFamiliar: $idGrupoFamiliar
      input: {
        apellido: $apellido
        email: $email
        fecha_nacimiento: $fecha_nacimiento
        genero: $genero
        nombre: $nombre
        id_parentesco: $id_parentesco
        num_doc_identidad: $num_doc_identidad
        representante: $representante
        telefono: $telefono
        tipo_doc_identidad: $tipo_doc_identidad
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
      tipo_doc_identidad
      num_doc_identidad
      nombre
      apellido
      telefono
      email
      genero
      fecha_nacimiento
      parentesco {
        parentesco
      }
      representante

      grupoFamiliar {
        id
        nombre_familiar
        manzana
        villa
        calle_principal
        calle_interseccion
        color_fachada
        tipo_edificacion
      }
    }
  }
`;

export const listadoIntegrante = gql`
  query {
    ListaIntegrantes {
      id
      tipo_doc_identidad
      num_doc_identidad
      nombre
      apellido
      telefono
      email
      genero
      fecha_nacimiento
      parentesco {
        parentesco
      }
      representante
      grupoFamiliar {
        id
        nombre_familiar
      }
    }
  }
`;

export const getIntegrante = gql`
  query ($id: Int!) {
    GetIntegrante(id: $id) {
      id
      tipo_doc_identidad
      num_doc_identidad
      nombre
      apellido
      telefono
      email
      genero
      fecha_nacimiento
      parentesco {
        id
        parentesco
      }
      representante
      grupoFamiliar {
        id
        nombre_familiar
      }
    }
  }
`;

export const updateIntegrante = gql`
  mutation (
    $id: Int!
    $apellido: String
    $email: String
    $fecha_nacimiento: String
    $genero: String
    $id_parentesco: Int
    $nombre: String
    $num_doc_identidad: String
    $representante: String
    $telefono: String
    $tipo_doc_identidad: String
  ) {
    UpdateIntegrante(
      id: $id
      input: {
        apellido: $apellido
        email: $email
        fecha_nacimiento: $fecha_nacimiento
        genero: $genero
        nombre: $nombre
        id_parentesco: $id_parentesco
        num_doc_identidad: $num_doc_identidad
        representante: $representante
        telefono: $telefono
        tipo_doc_identidad: $tipo_doc_identidad
      }
    ) {
      code
      message
    }
  }
`;

export const listaIntergranteFilter = gql`
  query (
    # $calle_interseccion: String
    # $calle_principal: String
    $idGrupoFamiliar: Int
  ) # $manzana: String
  {
    ListaIntegranteFilter(
      input: {
        # calle_interseccion: $calle_interseccion
        # calle_principal: $calle_principal
        idGrupoFamiliar: $idGrupoFamiliar
        # manzana: $manzana
      }
    ) {
      id
      tipo_doc_identidad
      num_doc_identidad
      nombre
      apellido
      telefono
      email
      genero
      fecha_nacimiento
      parentesco {
        parentesco
      }
      representante
      grupoFamiliar {
        id
        nombre_familiar
      }
    }
  }
`;
