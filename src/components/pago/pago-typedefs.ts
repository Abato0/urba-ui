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
    $id_aporte: Int
    $fecha_pago: String
  ) {
    ListaPagoFamiliarFilter(
      input: {
        idGrupoFamiliar: $idGrupoFamiliar
        id_aporte: $id_aporte
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
        monto
        status
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
    # $fecha_pago: String
    $fecha_subida: String
    $imagen_recibo: Upload
    # $monto: Int
    $pagoMes: String
    $cod_recibo: String
    $fecha_recibo: String
  ) {
    PostPago(
      idGrupoFamiliar: $idGrupoFamiliar
      idAporte: $idAporte
      input: {
        descripcion: $descripcion
        pagoMes:$pagoMes
        # fecha_pago: $fecha_pago
        fecha_subida: $fecha_subida
        imagen_recibo: $imagen_recibo
        # monto: $monto
        cod_recibo: $cod_recibo
        fecha_recibo: $fecha_recibo
      }
    ) {
      code
      message
    }
  }
`;
