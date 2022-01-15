import * as yup from "yup";
import {
  makeStyles,
  createStyles,
  colors,
  Box,
  TextField,
  Typography,
  Button,
} from "@material-ui/core";
import { useFormik } from "formik";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";
import { saveGrupoFamiliar } from "../../components/grupo-familiar/grupo-familiar-typeDefs";
import {
  useGrupoFamiliarMutation,
  useUpdateFamiliarMutation,
} from "../../components/grupo-familiar/use-grupo-familia";
import { FC, useCallback, useState } from "react";
import { DocumentNode } from "@apollo/client";
import { isEmpty, isNil, omit } from "ramda";
import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";
import ModalAuth from "../core/input/dialog/modal-dialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // backgroundColor:"red",
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      padding: "60px",
      minWidth: "320px",
      borderRadius: "10px",
      textAlign: "center",
      // width: "100%",
      // height: "100%",
      backgroundColor: "white",
      // marginTop: theme.spacing(2)
    },

    form: {
      display: "flex",
      flexDirection: "column",

      marginTop: theme.spacing(6),
    },
    button: {
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
        color: "white",
      },
      color: "white",
    },
    contentLastTextBox: {
      display: "flex",
      flexDirection: "row",
      alignContent: "center",
    },
    textbox: {
      margin: theme.spacing(1),
      width: theme.spacing(29),
    },
    contentButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: theme.spacing(5),
    },
  })
);

const initialValues = Object.freeze({
  nombre_familiar: "",
  celular: "",
  manzana: "",
  villa: "",
  calle: "",
});

const validationSchema = yup.object().shape({
  nombre_familiar: yup.string().required("Requerido"),
  celular: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Solo numeros")
    .min(10, "El numero debe teenr 10 digitos exactamente")
    .max(10, "El numero debe teenr 10 digitos exactamente")
    .required("Requerido"),
  manzana: yup.string().required("Requerido"),
  villa: yup.string().required("Requerido"),
  calle: yup.string().required("Requerido"),
});

interface IProps {
  mutation: DocumentNode;
  grupoFam?: IGrupoFamiliar;
  // nombre_familiar?: string;
  // celular?: string;
}

const GrupoFamiliarFormRegistro: FC<IProps> = ({ mutation, grupoFam }) => {
  const [mutate, loading, error] = isNil(grupoFam)
    ? useGrupoFamiliarMutation(mutation, {
        ...initialValues,
      })
    : useUpdateFamiliarMutation(
        0,
        {
          nombre_familiar: "",
          celular: "",
        },
        mutation
      );

  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");

  const onSubmit = useCallback(
    async (
      { nombre_familiar, celular, manzana, villa, calle },
      { setSubmitting }
    ) => {
      try {
        const { data } = isNil(grupoFam)
          ? await mutate({
              variables: {
                nombre_familiar: nombre_familiar,
                celular,
                manzana,
                villa,
                calle,
              },
            })
          : await mutate({
              variables: {
                id: Number(grupoFam.id),
                nombre_familiar: nombre_familiar,
                celular,
                manzana,
                villa,
                calle,
              },
            });
        console.log("data: ", data);
        setTitleModalMsj("Grupo Familiar Registrado");
        setMensajeModalMsj(data.message);
        setOpenModalMsj(true);
        // console.log("data: ", data, "loading: ", loading, "error: ", error);
      } catch (err) {
        console.log("error : ", err);
        setTitleModalMsj("Grupo Familiar no Registrado");
        setMensajeModalMsj(
          "Ha ocurrido un erro al resgistrar el grupo familiar"
        );
        setOpenModalMsj(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const init = !isNil(grupoFam) ? grupoFam : initialValues;

  const {
    errors,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    touched,
    values,
  } = useFormik({
    initialValues: init,
    onSubmit,
    validationSchema,
  });

  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {openModalMsj && (
        <ModalAuth
          openModal={openModalMsj}
          setOpenModal={setOpenModalMsj}
          title={titleModalMsj}
          message={mensajeModalMsj}
        />
      )}
      <Typography variant="h5"> Registro de Grupo Familiar</Typography>
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
            id="nombre_familiar"
            value={values.nombre_familiar}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="nombre_familia"
            label="Nombre del Grupo Familiar"
            margin="normal"
            error={
              touched.nombre_familiar && isNotNilOrEmpty(errors.nombre_familiar)
            }
            helperText={
              touched.nombre_familiar ? errors.nombre_familiar : undefined
            }
            required
          />

          <TextField
            className={classes.textbox}
            variant="outlined"
            id="celular"
            value={values.celular}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="celular"
            label="Numero de Celular"
            margin="normal"
            error={touched.celular && isNotNilOrEmpty(errors.celular)}
            helperText={touched.celular ? errors.celular : undefined}
            required
          />
        </div>

        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="manzana"
            value={values.manzana}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="manzana"
            label="Manzana"
            margin="normal"
            error={touched.manzana && isNotNilOrEmpty(errors.manzana)}
            helperText={touched.manzana ? errors.manzana : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="villa"
            value={values.villa}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="villa"
            label="Villa"
            margin="normal"
            error={touched.villa && isNotNilOrEmpty(errors.villa)}
            helperText={touched.villa ? errors.villa : undefined}
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="calle"
            value={values.calle}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="calle"
            label="Calle"
            margin="normal"
            error={touched.calle && isNotNilOrEmpty(errors.calle)}
            helperText={touched.calle ? errors.calle : undefined}
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

export default GrupoFamiliarFormRegistro;
