import { gql } from "@apollo/client";

export const listadoColor = gql`
  query {
    ListaColor {
      id
      color
    }
  }
`;

export const getColor = gql`
  query ($id: Int!) {
    GetColor(id: $id) {
      id
      color
    }
  }
`;

export const postColor = gql`
  mutation ($color: String) {
    PostColor(color: $color) {
      code
      message
    }
  }
`;

export const updateColor = gql`
  mutation ($id: Int!, $color: String) {
    PutColor(id: $id, color: $color) {
      code
      message
    }
  }
`;

export const deleteColor = gql`
  mutation ($id: Int!) {
    DeleteColor(id: $id) {
      code
      message
    }
  }
`;
