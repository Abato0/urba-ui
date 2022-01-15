import axios from 'axios'
import { concat } from 'ramda'
import { IUserInfo } from '../utils/states'
// import { URL_BASE_API } from '../utils/keys'
const URL_BASE_API = "http://localhost:8888"

export const login =async (user: string, password: string): Promise<IUserInfo>=>{

    // try {
        const resultado = await axios({
            method: "post",
            url: `${URL_BASE_API}/api/usuario/login`,
            withCredentials: true,
            data:{
                user, password
            }
        })
        return resultado.data
    // } catch (error) {
    //     console.log("error; ",error.msg)
    //     throw new Error(error)
    // }
    
}

