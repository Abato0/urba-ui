export interface AllPago {
    id: number
    grupoFamiliar: IGrupoFamiliar
    pago: IPago
}

interface IGrupoFamiliar {
    nombre_familiar: string
}
interface IPago {
    id: number
    fecha_pago: string
    fecha_subida: string
    // tipo_aporte: string;
    imagen_recibo?: string
    descripcion: string
    fecha_recibo: string
    // estado: string;
    tipo_pago: string
    monto: number
    cod_recibo?: string
}
