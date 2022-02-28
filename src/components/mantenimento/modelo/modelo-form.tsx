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
import {
  IResultQueryModelo,
  usePostModeloMutation,
  usePutModeloMutation,
} from "./use-modelo";
import SaveIcon from "@material-ui/icons/Save";


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
  modelo: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  modelo: yup.string().required("Campo requerido"),
});

interface IProps {
  modeloObj?: IResultQueryModelo;
  id?: number;
}

export const IngresarModeloForm: FC<IProps> = ({ modeloObj, id }) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const [boolPut, setBoolPut] = useState<boolean>(false);

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      router.push({ pathname: "/mantenimiento/marca/listado" });
    }
    // }, 2000);
  }, [boolPut, openModalMsj]);

  const [mutate] = isNil(modeloObj)
    ? usePostModeloMutation()
    : usePutModeloMutation();

  const init = useMemo(() => {
    return isNotNilOrEmpty(modeloObj)
      ? {
          modelo: modeloObj?.modelo,
        }
      : initialValues;
  }, [modeloObj]);

  const onSubmit = useCallback(async ({ modelo }) => {
    try {
      if (isNotNilOrEmpty(modelo)) {
        const { data } = isNil(modeloObj)
          ? await mutate({
              variables: {
                modelo,
              },
            })
          : await mutate({
              variables: {
                id,
                modelo,
              },
            });

        if (isNotNilOrEmpty(data)) {
          const { message } = isNotNilOrEmpty(data.PutModelo)
            ? data.PutModelo
            : data.PostModelo;
          setTitleModalMsj(message);

          //   setTimeout(() => {

          //   }, 2000);

          setErrorModal(false);
          // setMensajeModalMsj(dataMutate.message);
          setOpenModalMsj(true);
          if (isNotNilOrEmpty(data.PutModelo)) {
            setBoolPut(true);
          }
          resetForm();
        } else {
          setOpenModalMsj(true);
          setErrorModal(false);
          setTitleModalMsj("Usuario no autorizado");
        }
      }
    } catch (error: any) {
      console.log("error.;", error);
      setTitleModalMsj("Envio Fallido");
      setErrorModal(true);
      setMensajeModalMsj("El modelo no ha sido guardado: " + error.message);
      setOpenModalMsj(true);
    }
  }, []);

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
          Registro de Modelos de Vehiculos
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
            id="modelo"
            value={values.modelo}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Modelo"
            margin="normal"
            error={touched.modelo && isNotNilOrEmpty(errors.modelo)}
            helperText={touched.modelo ? errors.modelo : undefined}
            required
          />
        </div>
        <div className={classes.contentButtons}>
          <div></div>
          <Button type="submit" variant="outlined">
            {" "}
            Guardar
          </Button>
        </div>
      </form>
    </Box>
  );
};
