import { gql } from "@apollo/client";

export const listadoCalles = gql`
  query ListaCalles {
    ListaCalle {
      id
      calle
    }
  }
`;

export const getCalle = gql`
  query ($id: Int!) {
    GetCalle(id: $id) {
      id
      calle
    }
  }
`;

export const postCalle = gql`
  mutation ($calle: String) {
    PostCalle(calle: $calle) {
      code
      message
    }
  }
`;

export const updateCalle = gql`
  mutation ($id: Int!, $calle: String) {
    PutCalle(id: $id, calle: $calle) {
      code
      message
    }
  }
`;

export const deleteCalle = gql`
  mutation ($id: Int!) {
    DeleteCalle(id: $id) {
      code
      message
    }
  }
`;
