import { gql } from "@apollo/client";

export const listadoTags = gql`
  query {
    ListaTags {
      id
      tag {
        valorTag {
          id
          tipo_tag
          valor
        }
        fecha_pago
        monto
      }
      vehiculo {
        placa
        grupoFamiliar {
          id
          nombre_familiar
        }
      }
    }
  }
`;

// export const getColor = gql`
//   query ($id: Int!) {
//     GetColor(id: $id) {
//       id
//       color
//     }
//   }
// `;
