import { IResultUsuarioQuery } from '../components/usuarios/use-usuario'

export interface IGrupoFamiliar {
    id?: number
    nombre_familiar: string
    calle_principal: ICalle
    calle_interseccion: string
    manzana: IManzana
    villa: string
    extension: string
    usuario: IResultUsuarioQuery
    // tipo_edificacion: ITipoEdificacion;
    // color_fachada: IColorFachada;
}

export interface IGrupoFamiliarInput {
    nombre_familiar: string
    id_calle_principal: number
    calle_interseccion: string
    id_manzana: number
    // id_usuario: number
    villa: string
    extension: string
    // id_tipo_edificacion: number;
    // id_color_fachada: number;
}

export interface ICalle {
    id: number
    calle: string
}

export interface IColorFachada {
    id: number
    color: string
}

export interface IManzana {
    id: number
    manzana: string
}

export interface ITipoEdificacion {
    id: number
    tipo_edificacion: string
}
