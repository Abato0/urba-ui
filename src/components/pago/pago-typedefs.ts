import { gql } from "@apollo/client";

export const subirFoto = gql`
  mutation ($file: Upload) {
    singleUpload(file: $file) {
      code
      message
    }
  }
`;

export const listadoPago = gql`
  query AllPagos {
    ListaPagos {
      id
      grupoFamiliar {
        nombre_familiar
      }
      pago {
        fecha_pago
        tipo_aporte
        descripcion
        estado
        monto
      }
    }
  }
`;

export const getPagoFamiliar = gql`
  query GetPagoFamiliar($id: Int) {
    GetPagoFamiliar(id: $id) {
      id
      grupoFamiliar {
        nombre_familiar
      }
      pago {
        fecha_pago
        descripcion
        estado
        imagen_recibo
        monto
      }
    }
  }
`;

export const getPagoFamiliarFilter = gql`
  query ListaPagoFamiliarFilter(
    $idGrupoFamiliar: Int
    $tipo_aporte: String
    $fecha_pago: String
  ) {
    ListaPagoFamiliarFilter(
      input: {
        idGrupoFamiliar: $idGrupoFamiliar
        tipo_aporte: $tipo_aporte
        fecha_pago: $fecha_pago
      }
    ) {
      id
      grupoFamiliar {
        nombre_familiar
      }
      pago {
        fecha_pago
        descripcion
        estado
        monto
      }
      aporte {
        nombre_aporte
        tipo_aporte
      }
    }
  }
`;

export const savePago = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $idAporte: Int!
    $descripcion: String
    $fecha_pago: String
    $fecha_subida: String
    $imagen_recibo: Upload
    $monto: Int
    $cod_recibo: String
    $fecha_recibo: String
  ) {
    PostPago(
      idGrupoFamiliar: $idGrupoFamiliar
      idAporte: $idAporte
      input: {
        descripcion: $descripcion
        fecha_pago: $fecha_pago
        fecha_subida: $fecha_subida
        imagen_recibo: $imagen_recibo
        monto: $monto
        cod_recibo: $cod_recibo
        fecha_recibo: $fecha_recibo
      }
    ) {
      code
      message
    }
  }
`;
