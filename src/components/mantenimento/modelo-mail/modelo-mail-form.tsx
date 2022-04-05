import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import { useFormik } from "formik";
import { isNil } from "ramda";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { isNotNilOrEmpty } from "../../../utils/is-nil-empty";
import ModalAuth from "../../core/input/dialog/modal-dialog";
import { useRouter } from "next/router";

import SaveIcon from "@material-ui/icons/Save";
import { LoadingButton } from "@mui/lab";

import {
  IResultQueryModeloMail,
  useListaModeloMailQuery,
  usePutModeloMailMutation,
} from "./use-modelo-mail";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: "60px",

      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "white",
      width: "80%",
      // margin: theme.spacing(2),
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
    dropzone: {
      padding: theme.spacing(4),
      minWidth: 500,
    },
    button: {
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
        color: "white",
      },
      color: "white",
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
    title: {
      fontSize: theme.typography.pxToRem(12),
      backgroundColor: colors.grey[200],
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 5,
    },
  })
);

const initialValues = Object.freeze({
  categoria: "",
  titulo: "",
  asunto: "",
  textoSuperior: "",
  textoInferior: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  categoria: yup.string().required("Campo requerido"),
  titulo: yup.string().required("Campo requerido"),
  asunto: yup.string().required("Campo requerido"),
  textoSuperior: yup.string().required("Campo requerido"),
  textoInferior: yup.string().required("Campo requerido"),
});

interface IProps {
  modeloObj: IResultQueryModeloMail;
  id: number;
}

export const IngresarModeloMailForm: FC<IProps> = ({ modeloObj, id }) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [loadingMutate, setLoadingMutate] = useState<boolean>(false);

  const [boolPut, setBoolPut] = useState<boolean>(false);

  const { refetch } = useListaModeloMailQuery();

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      refetch().then(() => {
        router.push({ pathname: "/mantenimiento/modelo-mail/listado" });
      });
    }
    // }, 2000);
  }, [boolPut, openModalMsj, router]);

  const [mutate] = usePutModeloMailMutation();

  const init = useMemo(() => {
    return isNotNilOrEmpty(modeloObj)
      ? {
          categoria: modeloObj?.categoria,
          titulo: modeloObj?.titulo,
          asunto: modeloObj?.asunto,
          textoSuperior: modeloObj?.textoSuperior,
          textoInferior: modeloObj?.textoInferior,
        }
      : initialValues;
  }, [modeloObj]);

  const onSubmit = useCallback(
    async ({ categoria, titulo, asunto, textoSuperior, textoInferior }) => {
      try {
        if (
          isNotNilOrEmpty(categoria) &&
          isNotNilOrEmpty(titulo) &&
          isNotNilOrEmpty(asunto) &&
          isNotNilOrEmpty(textoSuperior) &&
          isNotNilOrEmpty(textoInferior)
        ) {
          setLoadingMutate(true);
          const { data } = await mutate({
            variables: {
              id,
              categoria,
              titulo,
              asunto,
              textoSuperior,
              textoInferior,
            },
          });

          if (isNotNilOrEmpty(data)) {
            const { message } = data.PutModeloMail;
            setLoadingMutate(false);
            setTitleModalMsj(message);

            //   setTimeout(() => {

            //   }, 2000);

            setErrorModal(false);
            setOpenModalMsj(true);
            // setMensajeModalMsj(dataMutate.message);

            if (isNotNilOrEmpty(data.PutModeloMail)) {
              setBoolPut(true);
            }

            // resetForm();
          } else {
            setLoadingMutate(false);
            setOpenModalMsj(true);
            setErrorModal(false);
            setTitleModalMsj("Usuario no autorizado");
          }
        }
      } catch (error: any) {
        setLoadingMutate(false);
        console.log("error.;", error);
        setTitleModalMsj("Envio Fallido");
        setErrorModal(true);
        setMensajeModalMsj("El modelo no ha sido guardado: " + error.message);
        setOpenModalMsj(true);
      }
    },
    [id, modeloObj]
  );

  const {
    errors,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    touched,
    values,
    resetForm,
  } = useFormik({
    initialValues: init,
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
      <div className={classes.title}>
        <Typography variant="overline">
          {modeloObj
            ? `Actualización de modelo de correo ${modeloObj.titulo}`
            : ""}
        </Typography>
      </div>

      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="categoria"
            value={values.categoria}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Categoria"
            margin="normal"
            error={touched.categoria && isNotNilOrEmpty(errors.categoria)}
            helperText={touched.categoria ? errors.categoria : undefined}
            required
            disabled
          />
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="titulo"
            value={values.titulo}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Titulo"
            margin="normal"
            error={touched.titulo && isNotNilOrEmpty(errors.titulo)}
            helperText={touched.titulo ? errors.titulo : undefined}
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="asunto"
            value={values.asunto}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Asunto"
            margin="normal"
            error={touched.asunto && isNotNilOrEmpty(errors.asunto)}
            helperText={touched.asunto ? errors.asunto : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="textoSuperior"
            value={values.textoSuperior}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Texto Superior"
            margin="normal"
            error={
              touched.textoSuperior && isNotNilOrEmpty(errors.textoSuperior)
            }
            helperText={
              touched.textoSuperior ? errors.textoSuperior : undefined
            }
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="textoInferior"
            value={values.textoInferior}
            onChange={handleChange}
            onBlur={handleBlur}
            label="TextoInferior"
            margin="normal"
            error={
              touched.textoInferior && isNotNilOrEmpty(errors.textoInferior)
            }
            helperText={
              touched.textoInferior ? errors.textoInferior : undefined
            }
            required
          />
        </div>
        <div className={classes.contentButtons}>
          <div></div>
          <LoadingButton
            loading={loadingMutate}
            loadingPosition="start"
            type="submit"
            variant="outlined"
            startIcon={<SaveIcon />}
          >
            Guardar
          </LoadingButton>
        </div>
      </form>
    </Box>
  );
};
