import { gql, useMutation } from "@apollo/client";

export const saveGrupoFamiliar = gql`
  mutation (
    $nombre_familiar: String
    $celular: String
    $manzana: String
    $villa: String
    $calle: String
  ) {
    PostGrupoFamiliar(
      input: {
        celular: $celular
        nombre_familiar: $nombre_familiar
        manzana: $manzana
        villa: $villa
        calle: $calle
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
    $nombre_familiar: String
    $celular: String
    $manzana: String
    $villa: String
    $calle: String
  ) {
    UpdateGrupoFamiliar(
      id: $id
      input: {
        nombre_familiar: $nombre_familiar
        celular: $celular
        manzana: $manzana
        villa: $villa
        calle: $calle
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
      celular
      manzana
      villa
      calle
    }
  }
`;

export const GetGrupoFamiliar = gql`
  query GrupoFamiliarOne($id: Int) {
    GetGrupoFamiliar(id: $id) {
      id
      nombre_familiar
      celular
      manzana
      villa
      calle
    }
  }
`;
