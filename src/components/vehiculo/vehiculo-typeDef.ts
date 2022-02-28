import { gql } from "@apollo/client";

export const saveVehiculo = gql`
  mutation (
    $idGrupoFamiliar: Int!
    $id_color: Int
    $id_marca: Int
    $matriculaFrontal: Upload
    $matriculaReverso: Upload
    $cedulaFrontal: Upload
    $cedulaReverso: Upload
    $id_modelo: Int
    $id_status: Int
    $placa: String
  ) {
    PostVehiculo(
      idGrupoFamiliar: $idGrupoFamiliar
      input: {
        placa: $placa
        id_marca: $id_marca
        id_color: $id_color
        id_modelo: $id_modelo
        id_status: $id_status
        matriculaFrontal: $matriculaFrontal
        matriculaReverso: $matriculaReverso
        cedulaFrontal: $cedulaFrontal
        cedulaReverso: $cedulaReverso
      }
    ) {
      code
      message
    }
  }
`;

export const listadoVehiculoFilter = gql`
  query VehiculosFilter(
    $idGrupoFamiliar: Int
    $marca: String
    $modelo: String
    $status: String
  ) {
    ListaVehiculoFilter(
      input: {
        idGrupoFamiliar: $idGrupoFamiliar
        marca: $marca
        modelo: $modelo
        status: $status
      }
    ) {
      id
      grupoFamiliar {
        id
        nombre_familiar
      }
      modelo {
        modelo
      }
      marca {
        marca
      }
      color {
        color
      }
      status {
        statusVehiculo
      }
      placa
      # matriculaPdf
    }
  }
`;

export const listadoVehiculo = gql`
  query AllVehiculos {
    ListaVehiculos {
      id
      grupoFamiliar {
        id
        nombre_familiar
      }
      modelo {
        modelo
      }
      marca {
        marca
      }
      color {
        color
      }
      status {
        statusVehiculo
      }
      placa
      # matriculaPdf
    }
  }
`;

export const listadoVehiculoInactivos = gql`
  query AllVehiculosInactivos {
    ListaVehiculosInactivos {
      id
      grupoFamiliar {
        id
        nombre_familiar
      }
      modelo {
        modelo
      }
      marca {
        marca
      }
      color {
        color
      }
      status {
        statusVehiculo
      }
      placa
      # matriculaPdf
    }
  }
`;

export const getVehiculo = gql`
  query GetVehiculo($id: Int!) {
    GetVehiculos(id: $id) {
      id
      grupoFamiliar {
        id
        nombre_familiar
      }
      modelo {
        id
        modelo
      }
      marca {
        id
        marca
      }
      color {
        id
        color
      }
      status {
        id
        statusVehiculo
      }
      placa
      matriculaFrontal
      matriculaReverso
      cedulaFrontal
      cedulaReverso
    }
  }
`;

export const updateVehiculo = gql`
  mutation (
    $id: Int!
    $id_color: Int
    $id_marca: Int
    $matriculaPdf: Upload
    $id_modelo: Int
    $id_status: Int
    $placa: String # $tipo_vehiculo: String
  ) {
    UpdateVehiculo(
      id: $id
      input: {
        # tipo_vehiculo: $tipo_vehiculo
        id_status: $id_status
        placa: $placa
        id_marca: $id_marca
        id_color: $id_color
        id_modelo: $id_modelo
        matriculaFrontal: $matriculaFrontal
        matriculaReverso: $matriculaReverso
        cedulaFrontal: $cedulaFrontal
        cedulaReverso: $cedulaReverso
      }
    ) {
      code
      message
    }
  }
`;

export const inactivarVehiculos = gql`
  mutation ($id: String) {
    InactivarVehiculos(id: $id) {
      code
      message
    }
  }
`;

export const activarVehiculos = gql`
  mutation ($id: String) {
    ActivarVehiculos(id: $id) {
      code
      message
    }
  }
`;
