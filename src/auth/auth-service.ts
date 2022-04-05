import axios from "axios";
import { concat } from "ramda";
import { IOutput } from "../components/mantenimento/calle/use-calle";
import { IUserInfo } from "../utils/states";
// import { URL_BASE_API } from '../utils/keys'
const URL_BASE_API = "http://localhost:8888";

export const login = async (
  user: string,
  password: string
): Promise<IUserInfo> => {
  const resultado = await axios({
    method: "post",
    url: `${URL_BASE_API}/api/usuario/login`,
    withCredentials: true,
    data: {
      user,
      password,
    },
  });
  return resultado.data;
};

export const authMe = async (token: string) => {
  const resultado = await axios({
    method: "get",
    url: `${URL_BASE_API}/api/usuario/me?token=${encodeURI(token)}`,
    withCredentials: true,
  });
  return resultado.data;
};

export const recordarContrasena = async (
  // user: string,
  // newPassword: string,
  num_identificacion: string
): Promise<IOutput> => {
  const resultado = await axios({
    method: "post",
    url: `${URL_BASE_API}/api/usuario/recordar-pass`,
    withCredentials: true,
    data: {
      // user,
      // newPassword,
      num_identificacion,
    },
  });

  return resultado.data;
};
