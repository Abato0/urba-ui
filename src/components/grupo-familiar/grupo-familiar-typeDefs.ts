import { gql, useMutation } from "@apollo/client";

export const saveGrupoFamiliar = gql`
  mutation (
    $calle_principal: String
    $calle_interseccion: String
    $color_fachada: String
    $manzana: String
    $nombre_familiar: String
    $tipo_edificacion: String
    $villa: Int
  ) {
    PostGrupoFamiliar(
      input: {
        calle_principal: $calle_principal
        calle_interseccion: $calle_interseccion
        color_fachada: $color_fachada
        manzana: $manzana
        nombre_familiar: $nombre_familiar
        tipo_edificacion: $tipo_edificacion
        villa: $villa
      }
    ) {
      code
      message
    }
  }
`;

export const updateGrupoFamiliarMutation = gql`
  mutation (
    $id: Int!
    $calle_principal: String
    $calle_interseccion: String
    $color_fachada: String
    $manzana: String
    $nombre_familiar: String
    $tipo_edificacion: String
    $villa: Int
  ) {
    UpdateGrupoFamiliar(
      id: $id
      input: {
        calle_principal: $calle_principal
        calle_interseccion: $calle_interseccion
        color_fachada: $color_fachada
        manzana: $manzana
        nombre_familiar: $nombre_familiar
        tipo_edificacion: $tipo_edificacion
        villa: $villa
      }
    ) {
      code
      message
    }
  }
`;

export const deleteGrupoFamiliarMutation = gql`
  mutation ($id: Int!) {
    DeleteGrupoFamiliar(id: $id) {
      code
      message
    }
  }
`;

export const listadoGrupoFamiliar = gql`
  query AllGrupoFamiliar {
    ListaGruposFamiliares {
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
`;

export const GetGrupoFamiliar = gql`
  query GrupoFamiliarOne($id: Int) {
    GetGrupoFamiliar(id: $id) {
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
`;

export const listarGruposFamiliares = gql`
  query GrupoFamiliarOne(
    $calle_interseccion: String
    $calle_principal: String
    $idGrupoFamiliar: Int
    $manzana: String
  ) {
    ListaGruposFamiliaresFilter(
      input: {
        calle_interseccion: $calle_interseccion
        calle_principal: $calle_principal
        idGrupoFamiliar: $idGrupoFamiliar
        manzana: $manzana
      }
    ) {
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
`;
