import axios from 'axios'
import { concat } from 'ramda'
import { IResultQueryImagenesSitio } from '../components/imagenes-de-bienvenida/use-imagenes-bienvenida'
import { IOutput } from '../components/mantenimento/calle/use-calle'
import { IUserInfo } from '../utils/states'
// import { URL_BASE_API } from '../utils/keys'
//const URL_BASE_API = 'https://urbaapi.nodedatatest.com'
const URL_BASE_API = 'http://localhost:8888'

export const userRepresentante = async (
    idUser: number
): Promise<{ ok: boolean; message: string }> => {
    const result = await axios({
        method: 'GET',
        url: `${URL_BASE_API}/api/usuario/representante?idUser=${idUser}`,
    })
    return result.data
}

export const login = async (
    user: string,
    password: string
): Promise<IUserInfo> => {
    const resultado = await axios({
        method: 'post',
        url: `${URL_BASE_API}/api/usuario/login`,
        withCredentials: true,
        data: {
            user,
            password,
        },
        headers: {
            'Access-Control-Allow-Origin': URL_BASE_API,
        },
    })
    return resultado.data
}

export const authMe = async (token: string) => {
    const resultado = await axios({
        method: 'get',
        url: `${URL_BASE_API}/api/usuario/me?token=${encodeURI(token)}`,
        withCredentials: true,
    })
    return resultado.data
}

export const imagenesLogin = async () => {
    const resultado = await axios({
        method: 'get',
        url: `${URL_BASE_API}/api/usuario/imagenes/login`,
    })
    return resultado.data as IResultQueryImagenesSitio[]
}

export const imagenesRecordarContrasena = async () => {
    const resultado = await axios({
        method: 'get',
        url: `${URL_BASE_API}/api/usuario/imagenes/recordar-contrasena`,
    })
    return resultado.data as IResultQueryImagenesSitio[]
}

export const recordarContrasena = async (
    // user: string,
    // newPassword: string,
    num_identificacion: string
): Promise<IOutput> => {
    const resultado = await axios({
        method: 'post',
        url: `${URL_BASE_API}/api/usuario/recordar-pass`,
        withCredentials: true,
        data: {
            // user,
            // newPassword,
            num_identificacion,
        },
    })

    return resultado.data
}
