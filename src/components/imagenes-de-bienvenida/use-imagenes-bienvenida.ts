import { useMutation, useQuery } from '@apollo/client'
import { IOutput } from '../mantenimento/calle/use-calle'
import {
    deleteImageBienvenida,
    listadoImagenesBienvenida,
    postImagenBienvenida,
} from './imagenes-de-bienvenida-typedef'

export interface IPostImagenSitio {
    PostImagenSitio: IOutput
}

export interface IDelteImagenSitio {
    DeleteImagenSitio: IOutput
}

export interface IListaImagenesSitio {
    ListaImagenesSitio: IResultQueryImagenesSitio[]
}

export interface IResultQueryImagenesSitio {
    id: number
    nombre: string
    urlImagen: string
    lugar: string
}

export const useListadoImagenesBienvenidaQuery = () => {
    return useQuery<IListaImagenesSitio>(listadoImagenesBienvenida)
}

export const usePostImagenBienvenidaMutation = () => {
    const [mutate] = useMutation(postImagenBienvenida)
    return [mutate]
}

export const useDeleteImagenBienvenidaMutation = () => {
    const [mutate] = useMutation(deleteImageBienvenida)
    return [mutate]
}
