import { gql } from "@apollo/client";

export const saveIntegrante = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $apellido: String
    $email: String
    $fecha_nacimiento: String
    $genero: String
    $nombre: String
    $num_doc_identidad: String
    $piso_ocupa: String
    $status: String
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
        num_doc_identidad: $num_doc_identidad
        piso_ocupa: $piso_ocupa
        status: $status
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
      piso_ocupa
      status
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
      piso_ocupa
      status
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
      piso_ocupa
      status
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

export const updateIntegrante = gql`
  mutation (
    $id: Int!
    $apellido: String
    $email: String
    $fecha_nacimiento: String
    $genero: String
    $nombre: String
    $num_doc_identidad: String
    $piso_ocupa: String
    $status: String
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
        num_doc_identidad: $num_doc_identidad
        piso_ocupa: $piso_ocupa
        status: $status
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
    $calle_interseccion: String
    $calle_principal: String
    $idGrupoFamiliar: Int
    $manzana: String
  ) {
    ListaIntegranteFilter(
      input: {
        calle_interseccion: $calle_interseccion
        calle_principal: $calle_principal
        idGrupoFamiliar: $idGrupoFamiliar
        manzana: $manzana
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
      piso_ocupa
      status
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
