import { gql } from '@apollo/client'

export const saveAporte = gql`
    mutation (
        $cuotas: Int
        $fecha_inicio: String
        $nombre_aporte: String
        $tipo_aporte: String
        $valor_mensual: Int
    ) {
        PostAporte(
            input: {
                cuotas: $cuotas
                fecha_inicio: $fecha_inicio
                nombre_aporte: $nombre_aporte
                tipo_aporte: $tipo_aporte
                valor_mensual: $valor_mensual
            }
        ) {
            code
            message
        }
    }
`

export const listarAportes = gql`
    query AllAportes {
        ListaAportes {
            id
            nombre_aporte
            tipo_aporte
            cuotas
            valor_mensual
            fecha_inicio
            fecha_fin
        }
    }
`

export const arrIntervaloFechaAporte = gql`
    query ListaIntervaloFechaAporte($id: Int) {
        ArrIntervaloFechaAporte(id: $id)
    }
`
