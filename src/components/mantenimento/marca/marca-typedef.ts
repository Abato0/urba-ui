import { gql } from "@apollo/client";

export const listadoMarca = gql`
  query {
    ListaMarca {
      id
      marca
    }
  }
`;

export const getMarca = gql`
  query ($id: Int!) {
    GetMarca(id: $id) {
      id
      marca
    }
  }
`;

export const postMarca = gql`
  mutation ($marca: String) {
    PostMarca(marca: $marca) {
      code
      message
    }
  }
`;

export const updateMarca = gql`
  mutation ($id: Int!, $marca: String) {
    PutMarca(id: $id, marca: $marca) {
      code
      message
    }
  }
`;

export const deleteMarca = gql`
  mutation ($id: Int!) {
    DeleteMarca(id: $id) {
      code
      message
    }
  }
`;
