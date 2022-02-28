import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
  Paper,
} from "@material-ui/core";
import { useState, useCallback, useEffect } from "react";
import ModalAuth from "../core/input/dialog/modal-dialog";
import * as yup from "yup";
import { useFormik } from "formik";
import FormControlHeader from "../core/input/form-control-select";
import { listadoGrupoFamiliar } from "../grupo-familiar/grupo-familiar-typeDefs";
import { useQuery } from "@apollo/client";
import { isNil, isEmpty } from "ramda";
import {
  IListadoGrupoFamiliarVariables,
  useListarGrupoFamiliar,
} from "../grupo-familiar/use-grupo-familia";
import { tipoUsuarios } from "../core/input/dateSelect";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import ImageIcon from "@material-ui/icons/Image";
import { useDropzone } from "react-dropzone";
import { usePostUsuarioMutation } from "./use-usuario";
import { CardMedia } from "@material-ui/core";
import { getBase64 } from "../../utils/file-base64";
import Image from "next/image";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      marginLeft: theme.spacing(20),
      marginRight: theme.spacing(20),
      padding: "60px",
      // minWidth: "820px",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "white",
      // width:"100px"
    },
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 220,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      marginTop: theme.spacing(6),
    },
    textbox: {
      margin: theme.spacing(1),
      width: theme.spacing(29),
    },

    button: {
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
        color: "white",
      },
      color: "white",
    },
    dropzone: {
      display: "flex",
      justifyContent: "center",
      // alignItems: "center",
      padding: theme.spacing(4),
      minWidth: 500,
      backgroundColor: colors.grey[700],
      color: "white",
      maxWidth: 700,
    },

    contentButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: theme.spacing(5),
    },
    contentLastTextBox: {
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
    },
  })
);

const validationSchema = yup.object().shape({
  idGrupoFamiliar: yup.number().required("Campo requerido"),
  user: yup.string().required("Campo requerido"),
  password: yup.string().required("Campo requerido"),
  tipo_usuario: yup.string().required("Campo requerido"),
});

const initialValues = Object.freeze({
  idGrupoFamiliar: undefined,
  user: "",
  password: "",
  tipo_usuario: "",
});

export const FormIngresarUsuario = () => {
  const classes = useStyles();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const [imgBase64, setImgBase64] = useState<string>();

  useEffect(() => {
    if (!isNil(file)) {
      getBase64(file).then((result) => {
        console.log("result: ", String(result));
        setImgBase64(String(result));
      });
    }
  }, [file]);

  const [dataGrupoFamiliar, setDataGrupoFamiliar] = useState<
    IListadoGrupoFamiliarVariables[]
  >([]);

  const onDrop = useCallback(([file]: [File]) => {
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg , image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const {
    data: dataListaGrupoFamiliar,
    loading: loadingListaGrupoFamiliar,
    error: errorListaGrupoFamiliar,
  } = useListarGrupoFamiliar();

  useEffect(() => {
    if (!loadingListaGrupoFamiliar && !isNil(dataListaGrupoFamiliar)) {
      setDataGrupoFamiliar(dataListaGrupoFamiliar.ListaGruposFamiliares);
      console.log("data: ", dataListaGrupoFamiliar.ListaGruposFamiliares);
    }
  }, [loadingListaGrupoFamiliar]);

  const [mutate] = usePostUsuarioMutation();

  const onSubmit = useCallback(
    async ({ idGrupoFamiliar, user, password, tipo_usuario }, {}) => {
      if (
        isNotNilOrEmpty(idGrupoFamiliar) &&
        isNotNilOrEmpty(user) &&
        isNotNilOrEmpty(password) &&
        isNotNilOrEmpty(tipo_usuario)
      ) {
        const { data, loading, error } = await mutate({
          variables: {
            idGrupoFamiliar: idGrupoFamiliar,
            imagen_perfil: file,
            password: password,
            tipo_usuario: tipo_usuario,
            user: user,
          },
        });
        if (
          !loading &&
          isNotNilOrEmpty(data) &&
          isNotNilOrEmpty(data.PostPago)
        ) {
          const { message } = data.PostUsuario;
          setErrorModal(false);
          setOpenModalMsj(true);
          setTitleModalMsj(message);

          resetForm();
        } else if (!loading && data === null) {
          setOpenModalMsj(true);
          setTitleModalMsj("Usuario no autorizado");
          setErrorModal(true);
        }
      }
      try {
      } catch (err: any) {
        console.log("error : ", err);
        setTitleModalMsj("Envio Fallido");
        setErrorModal(true);
        setMensajeModalMsj("Usuario no ha sido guardado: " + err.message);
        setOpenModalMsj(true);
      }
    },
    []
  );

  const {
    errors,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    touched,
    setFieldValue,
    resetForm,
    values,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Box className={classes.root}>
      {openModalMsj && (
        <ModalAuth
          openModal={openModalMsj}
          setOpenModal={setOpenModalMsj}
          title={titleModalMsj}
          message={mensajeModalMsj}
          error={errorModal}
        />
      )}
      <Typography variant="h5">
        {" "}
        Registro de Usuarios de los Grupos Familiares
      </Typography>
      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div className={classes.contentLastTextBox}>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="idGrupoFamiliar"
            handleChange={handleChange}
            labetTitulo=" Grupo Familiar del Deposito"
            value={values.idGrupoFamiliar}
          >
            {!loadingListaGrupoFamiliar &&
              dataGrupoFamiliar &&
              dataGrupoFamiliar.map(({ id, nombre_familiar }) => {
                return <MenuItem value={id}>{nombre_familiar}</MenuItem>;
              })}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="tipo_usuario"
            handleChange={handleChange}
            labetTitulo="Tipo de Usuario"
            value={values.tipo_usuario}
          >
            {tipoUsuarios.map(({ label, value }) => {
              return (
                <MenuItem key={"Ingreso-Usuario-" + value} value={value}>
                  {label}
                </MenuItem>
              );
            })}
          </FormControlHeader>
        </div>

        <div>
          <TextField
            className={classes.textbox}
            id="user"
            name="user"
            label="Usuario"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.user}
            error={touched.user && isNotNilOrEmpty(errors.user)}
            helperText={touched.user ? errors.user : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="password"
            name="password"
            label="Contraseña"
            type={"password"}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            error={touched.password && isNotNilOrEmpty(errors.password)}
            helperText={touched.password ? errors.password : undefined}
            required
          />
        </div>

        {!isNotNilOrEmpty(imgBase64) && (
          <div>
            <Image src={imgBase64!} alt="test" width={400} height={400} />
          </div>
          //   <Image width={40} height={40} src={`${imgBase64}`} />
        )}

        <Paper {...getRootProps()} className={classes.dropzone}>
          <input {...getInputProps()} />
          <ImageIcon fontSize="large" />
          <Typography variant="overline">
            {"Haga click en este Cuadro para subir su imagen de Perfil"}
          </Typography>
          {!isNilOrEmpty(file) && (
            <Typography variant="body2">
              {" "}
              {" *" + String(file?.path)}
            </Typography>
          )}
        </Paper>

        {/* <CardMedia/> */}

        <div className={classes.contentButtons}>
          <div></div>
          <Button type="submit" variant="outlined">
            {" "}
            Enviar
          </Button>
        </div>
      </form>
    </Box>
  );
};
