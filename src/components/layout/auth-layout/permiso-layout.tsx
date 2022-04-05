import { LinearProgress } from "@material-ui/core";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { equals } from "ramda";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authMe } from "../../../auth/auth-service";
import { userInfo } from "../../../utils/states";

interface IProps {
  tipoUsuarioRecibido: string[];
}
const PermisoLayout: React.FC<IProps> = ({ children, tipoUsuarioRecibido }) => {
  const router = useRouter();
  const [authFlag, setAuthFlag] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const usuarioState = useRecoilValue(userInfo);

  const autho = async () => {
    try {
      if (usuarioState) {
        console.log(
          "usuarioState",
          usuarioState,
          "tipoUsuarioRecibido:",
          tipoUsuarioRecibido
        );
        const { tipo_usuario } = usuarioState;

        const t_usuario = tipoUsuarioRecibido.find((t_user) =>
          equals(tipo_usuario, t_user)
        );

        if (t_usuario) {
          setAuthFlag(true);
        } else {
          setAuthFlag(false);
          await redirectLogin();
        }
      } else {
        setAuthFlag(false);
        await redirectLogin();
      }

      console.log("authFlag.", authFlag);
    } catch (error) {
      setAuthFlag(false);
      setLoading(false);
      await redirectLogin();
      console.log("error: ", (error as Error).message);
    }
  };

  const redirectLogin = async () => {
    return await router.push("/home");
  };

  useEffect(() => {
    autho();
  }, []);
  return (
    <>
      {authFlag ? (
        <>{children}</>
      ) : authFlag === undefined ? (
        <>
          <LinearProgress />
        </>
      ) : null}
    </>
  );
};

export default PermisoLayout;
