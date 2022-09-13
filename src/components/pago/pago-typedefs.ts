import { gql } from '@apollo/client'

export const subirFoto = gql`
    mutation ($file: Upload) {
        singleUpload(file: $file) {
            code
            message
        }
    }
`

export const migracionPagoTag = gql`
    mutation ($file: Upload) {
        MigracionExcelPagosTag(excel: $file) {
            code
            message
        }
    }
`

export const migracionPagoImplementacion = gql`
    mutation ($file: Upload) {
        MigracionExcelPagosImplementacion(excel: $file) {
            code
            message
        }
    }
`

export const migracionPagoOtros = gql`
    mutation ($file: Upload) {
        MigracionExcelOtros(excel: $file) {
            code
            message
        }
    }
`

export const migracionPagoMantenimiento = gql`
    mutation ($file: Upload) {
        MigracionExcelPagosMantenimiento(excel: $file) {
            code
            message
        }
    }
`

export const pagosDashboard = gql`
    query PagosDashboard($fechaDesde: String, $fechaHasta: String) {
        ListadoPagosDashboard(
            fechaDesde: $fechaDesde
            fechaHasta: $fechaHasta
        ) {
            implementacion {
                monto
                fecha
            }
            mantenimiento {
                monto
                fecha
            }
            tag {
                monto
                fecha
            }
            otros {
                monto
                fecha
            }
            fechas
        }
    }
`

export const listadoPago = gql`
    query AllPagos {
        ListaPagos {
            id
            grupoFamiliar {
                nombre_familiar
            }
            pago {
                fecha_pago
                tipo_pago
                descripcion
                monto
                fecha_subida
                fecha_recibo
                cod_recibo
            }
        }
    }
`

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
                tipo_pago
                # estado
                imagen_recibo
                monto
                fecha_subida
                fecha_recibo
            }
        }
    }
`

export const getPagoFamiliarFilter = gql`
    query ListaPagoFamiliarFilter(
        $idGrupoFamiliar: Int
        # $id_aporte: Int
        $mes: String
        $anio: Int
        $tipo_pago: String
    ) {
        ListaPagoFamiliarFilter(
            input: {
                idGrupoFamiliar: $idGrupoFamiliar
                # id_aporte: $id_aporte
                mes: $mes
                anio: $anio
                tipo_pago: $tipo_pago
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
                tipo_pago
                fecha_subida
                fecha_recibo
                cod_recibo
                # status
            }
            # aporte {
            #   nombre_aporte
            #   tipo_aporte
            # }
        }
    }
`

export const savePago = gql`
    mutation (
        $idGrupoFamiliar: Int!
        # $idAporte: Int!
        $descripcion: String
        # $fecha_pago: String
        $fecha_subida: String
        $imagen_recibo: Upload
        # $monto: Int
        # $pagoMes: String
        $cod_recibo: String
        $fecha_recibo: String
        $mantenimiento: [PagoMantenimiento]
        $otros: PagoOtros
        $implementacion: Int
        $tag: [PagoTag]
    ) {
        PostPago(
            idGrupoFamiliar: $idGrupoFamiliar
            # idAporte: $idAporte
            input: {
                descripcion: $descripcion
                # pagoMes:$pagoMes
                # fecha_pago: $fecha_pago
                fecha_subida: $fecha_subida
                imagen_recibo: $imagen_recibo
                # monto: $monto
                cod_recibo: $cod_recibo
                fecha_recibo: $fecha_recibo
                mantenimiento: $mantenimiento
                otros: $otros
                implementacion: $implementacion
                tag: $tag
            }
        ) {
            code
            message
        }
    }
`

export const carteraVencida = gql`
    query CarteraVencida($fecha: String) {
        CarteraVencida(fecha: $fecha) {
            keys
            data
        }
    }
`

export const matrizOperaciones = gql`
    query MatrizOperaciones($fechaDesde: String, $fechaHasta: String) {
        MatrizOperaciones(fechaDesde: $fechaDesde, fechaHasta: $fechaHasta) {
            keys
            data
        }
    }
`

export const deletePago = gql`
    mutation ($id: Int!) {
        DeletePago(id: $id) {
            code
            message
        }
    }
`
