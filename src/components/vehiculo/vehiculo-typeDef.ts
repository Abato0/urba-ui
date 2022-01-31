import { gql } from "@apollo/client";

export const saveVehiculo = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $tipo_vehiculo: String
    $placa: String
    $marca: String
    $color: String
    $modelo: String
    $matriculaPdf: Upload
  ) {
    PostPago(
      idGrupoFamiliar: $idGrupoFamiliar
      idAporte: $idAporte
      input: {
        tipo_vehiculo: $tipo_vehiculo
        placa: $placa
        marca: $marca
        color: $color
        modelo: $modelo
        matriculaPdf: $matriculaPdf
      }
    ) {
      code
      message
    }
  }
`;
