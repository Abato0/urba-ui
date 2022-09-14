import axios from 'axios'
import Cookies from 'js-cookie'

const URL_BASE_API = 'http://localhost:8888'
// const URL_BASE_API = 'https://urbaapi.nodedatatest.com'
const API = axios.create({
    baseURL: URL_BASE_API,
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
})

API.interceptors.response.use(
    (response) => {
        // if (response.status != 200 && response.status != 201) {
        //     throw new Error(`Error código: ${response.data.msg}`)
        // }
        return response
    },
    (error) => {
        console.log('ok', error.response)
        if (error.response === undefined) {
            throw new Error(
                `No se puede conectar al API, no tiene acceso a internet`
            )
        }
        if (error.response.status === 403 || error.response.status === 401) {
            console.log('se exp**iró el token')
            Cookies.remove('token')
            throw new Error(`Usuario incorrecto: ${error.response.data.msg}`)
        }

        // if (error.response.data.statusCode !== 200) {
        //     throw new Error(`${error.response.data.message}`)
        // }
    }
)

export { API }
