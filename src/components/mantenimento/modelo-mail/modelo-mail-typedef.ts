import { gql } from "@apollo/client";

export const listadoModeloMail = gql`
  query {
    ListaModeloMail {
      id
      categoria
      titulo
      asunto
      textoSuperior
      textoInferior
    }
  }
`;

export const getModeloMail = gql`
  query ($id: Int!) {
    GetModeloMail(id: $id) {
      id
      categoria
      titulo
      asunto
      textoSuperior
      textoInferior
    }
  }
`;

export const PutModeloMail = gql`
  mutation (
    $id: Int!
    $titulo: String
    $asunto: String
    $textoSuperior: String
    $textoInferior: String
  ) {
    PutModeloMail(
      id: $id
      input: {
        titulo: $titulo
        asunto: $asunto
        textoSuperior: $textoSuperior
        textoInferior: $textoInferior
      }
    ) {
      code
      message
    }
  }
`;
