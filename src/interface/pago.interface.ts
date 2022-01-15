export interface AllPago {
  id: number;
  grupoFamiliar: IGrupoFamiliar;
  pago: IPago;
}

interface IGrupoFamiliar {
  nombre_familiar: string;
}
interface IPago {
  id: number;
  fecha_pago: string;
  tipo_aporte: string;
  imagen_recibo?: string;
  descripcion: string;
  estado: string;
  monto: number;
}
