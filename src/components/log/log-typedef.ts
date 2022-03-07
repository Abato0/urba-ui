import { gql } from "@apollo/client";

export const listadoLogs = gql`
  query {
    ListaLog {
      id
      modulo
      usuario
      tipoUsuario
      fecha
      accion
      nombre_familiar
    }
  }
`;
