import { range } from "ramda";

const primeraPeatonal = "(primera peatonal)";
const segundaPeatonal = "(segunda peatonal)";
const terceraPeatonal = "(tercera peatonal)";
const cuartaPeatonal = "(cuarta peatonal)";
const quintaPeatonal = "(quinta peatonal)";
const sextaPeatonal = "(sexta peatonal)";
const septimaPeatonal = "(septima peatonal)";
const octavaPeatonal = "(octava peatonal)";

export const CallesPrincipales: string[] = [
  "28 de Mayo",
  `28 de Mayo ${primeraPeatonal}`,
  `28 de Mayo ${segundaPeatonal}`,
  `28 de Mayo ${terceraPeatonal}`,
  `28 de Mayo ${cuartaPeatonal}`,
  `28 de Mayo ${quintaPeatonal}`,
  `28 de Mayo ${sextaPeatonal}`,
  `28 de Mayo ${septimaPeatonal}`,
  `28 de Mayo ${octavaPeatonal}`,
  `Acacias`,
  "Almendros",
  `Almendros ${primeraPeatonal}`,
  `Almendros ${segundaPeatonal}`,
  `Almendros ${terceraPeatonal}`,
  `Almendros ${cuartaPeatonal}`,
  `Almendros ${quintaPeatonal}`,
  "Bosque",
  "Chirimoyas",
  "Ciruelos",
  `Ciruelos ${primeraPeatonal}`,
  `Ciruelos ${segundaPeatonal}`,
  `Ciruelos ${terceraPeatonal}`,
  `Ciruelos ${cuartaPeatonal}`,
  `Ciruelos ${quintaPeatonal}`,
  "Guayabos",
  `Guayabos ${quintaPeatonal}`,
  "Limones",
  "Mangos",
  `Mangos ${primeraPeatonal}`,
  `Mangos ${segundaPeatonal}`,
  `Mangos ${terceraPeatonal}`,
  `Mangos ${cuartaPeatonal}`,
  `Mangos ${quintaPeatonal}`,
  "Naranjo",
  "Palmas",
  `Palmas ${quintaPeatonal}`,
  "Toronjas",
];

export const calleInterseccion: string[] = [
  "28 de Mayo",
  "Acacias",
  "Almendros",
  "Bosque",
  "Chirimoyas",
  "Ciruelos",
  "Guayabos",
  "Limones",
  "Mangos",
  "Naranjos",
  "Palmas",
  "Toronjas",
];

export const manzanas: string[] = [
  "5",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
];

export const coloresPrincipalesFachada: string[] = [
  "Naranja",
  "Beige / crema",
  "Negro",
  "Azul",
  "Cafe / marron",
  "Verde",
  "Amarillo",
  "Mostaza",
  "Turquesa / cyan",
  "Celeste",
  "Ladrillo",
  "Violeta / morado",
  "Rojo / rosado / fucsia / salmon",
  "Blanco / blanco hueso",
  "Gris / plomo",
];

interface ITipoEdificacion {
  label: string;
  value: string;
}

export const tiposEdificacion: ITipoEdificacion[] = [
  {
    label: "Construcción de una planta (solo PB)",
    value: "Construccion de una planta",
  },
  {
    label: "Construcción de dos planta (PB y P1)",
    value: "Construccion de dos planta",
  },
  {
    label: "Construcción de tres planta (PB, P1 y P2)",
    value: "Construccion de tres planta",
  },
  {
    label: "Construcción de cuatro planta (PB, P1, P2 y P3)",
    value: "Construccion de cuatro planta",
  },
  {
    label: "Terreno baldío sin ninguna Construcción",
    value: "Ninguna construccion",
  },
];

export const plantaEdificacion: string[] = ["PB", "P1", "P2", "P3", "P4"];

export const status_integrante: string[] = [
  "Propietario",
  "Inquilino o arrendatario",
  "Familiar",
  "Comercial",
];

export const arrMeses: string[] = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const tipoDocumentosIdentidad: string[] = [
  "Cedula",
  "Ruc",
  "Pasaporte",
  "Carnet de extranjeria",
];

export const arrAnios: number[] = range(2000, 2200);

export enum ETipoAporte {
  implementacion = "Implementacion",
  mantenimiento = "Mantenimiento",
}
