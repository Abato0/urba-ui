import { useMutation } from "@apollo/client";
import { saveUsuario, updateUsuario } from "./usuario-typeDefs";

export interface IUsuarioInput {
  idGrupoFamiliar: number;
  imagen_perfil: File;
  password: string;
  tipo_usuario: string;
  user: string;
}

export const usePostUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(saveUsuario);

  return [mutate, data, loading, error];
};

export const useUpdateUsuarioMutation = () => {
  const [mutate, { data, loading, error }] = useMutation(updateUsuario);
  return [mutate, data, loading, error];
};



