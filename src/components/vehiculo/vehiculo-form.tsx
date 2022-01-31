import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  MenuItem,
  TextField,
  Button,
} from "@material-ui/core";
import React from "react";
import ModalAuth from "../core/input/dialog/modal-dialog";
import * as yup from "yup";
import { useFormik } from "formik";
import { useQuery } from "@apollo/client";
import { listadoGrupoFamiliar } from "../grupo-familiar/grupo-familiar-typeDefs";
import FormControlHeader from "../core/input/form-control-select";
import { useListarGrupoFamiliar } from "../grupo-familiar/use-grupo-familia";
import { isNotEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import { tiposVehiculos } from "../core/input/dateSelect";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // backgroundColor:"red",
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      padding: "60px",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    formControl: {
      margin: theme.spacing(1),
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
    textbox_descripcion: {
      margin: theme.spacing(1),
      width: theme.spacing(60),
    },
    dropzone: {
      display: "flex",
      justifyContent: "center",
      // alignItems: "center",
      padding: theme.spacing(4),
      minWidth: 500,
      backgroundColor: colors.lightGreen[700],
      color: "white",
      maxWidth: 700,
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
    title: {
      // display: "flex",
      // flexDirection: "row",
      width: "100%",
      // backgroundColor: "red"
    },
    list: {
      display: "flex",
      flexDirection: "column",
      width: "100%",

      alignItems: "center",
      justifyContent: "center",
      justifyItems: "center",
    },
    listItem: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    containerLabelPago: {
      marginTop: 20,
      padding: 15,
      color: "white",
      background: colors.green[800],
    },
    labelMonto: {
      fontWeight: theme.typography.pxToRem(60),
      fontFamily: theme.typography.fontWeightBold,
    },
  })
);

const initialValues = Object.freeze({
  idGrupoFamiliar: undefined,
  tipo_vehiculo: "",
  placa: "",
  marca: "",
  color: "",
  modelo: "",
  // matriculaPdf: ""
});

const validationSchema = yup.object().shape({
  id_aporte: yup.number().required("Campo Requerido"),
  tipo_vehiculo: yup.string().required("Campo Requerido"),
  placa: yup.string().required("Campo Requerido"),
  marca: yup.string().required("Campo Requerido"),
  color: yup.string().required("Campo Requerido"),
  modelo: yup.string().required("Campo Requerido"),
});

const FormIngresarVehiculos = () => {
  const classes = useStyles();
  const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = React.useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>("");
  const [errorModal, setErrorModal] = React.useState<boolean>(false);

  const [file, setFile] = React.useState<File>();

  const {
    data: dataGrupoFamiliar,
    loading: loadingGrupoFamiliar,
    error: errorGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const onSubmit = React.useCallback(
    async ({ idGrupoFamiliar, tipo_vehiculo, placa, marca, color, modelo }) => {
      try {
      } catch (error) {
        console.log("error : ", error);
        setTitleModalMsj("Registro Fallido");
        setMensajeModalMsj(
          "El registro del vehiculo no se ha realizado: " + error.message
        );
        setOpenModalMsj(true);
        setErrorModal(true);
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
    setFieldValue,
    resetForm,
    isSubmitting,
    touched,
    values,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Box className={classes.root} component={"div"} minWidth={"md"}>
      {openModalMsj && (
        <ModalAuth
          openModal={openModalMsj}
          setOpenModal={setOpenModalMsj}
          title={titleModalMsj}
          message={mensajeModalMsj}
          error={errorModal}
        />
      )}
      <Typography variant="h5" className={classes.title}>
        {" "}
        Registro de Vehiculos
      </Typography>
      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="idGrupoFamiliar"
            handleChange={handleChange}
            labetTitulo=" Grupo Familiar del Deposito"
            value={values.idGrupoFamiliar}
          >
            {!loadingGrupoFamiliar &&
              isNotNilOrEmpty(dataGrupoFamiliar) &&
              dataGrupoFamiliar?.ListaGruposFamiliares.map(
                ({ id, nombre_familiar }) => {
                  return (
                    <MenuItem
                      key={"vehiculo-listado-grupofamiliar-" + id}
                      value={id}
                    >
                      {nombre_familiar}
                    </MenuItem>
                  );
                }
              )}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="tipo_vehiculo"
            handleChange={handleChange}
            labetTitulo=" Tipo de Vehiculo"
            value={values.tipo_vehiculo}
          >
            {tiposVehiculos.map((t_vehiculo) => {
              return (
                <MenuItem
                  key={"listado-t-vehiculo-ingresar-" + t_vehiculo}
                  value={t_vehiculo}
                >
                  {" "}
                  {t_vehiculo}
                </MenuItem>
              );
            })}
          </FormControlHeader>
        </div>

        <div>
          <TextField
            className={classes.textbox}
            id="marca"
            name="marca"
            label="Marca del Vehiculo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.marca}
            error={touched.marca && isNotNilOrEmpty(errors.marca)}
            helperText={touched.marca ? errors.marca : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="modelo"
            name="modelo"
            label="Modelo del Vehiculo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.modelo}
            error={touched.modelo && isNotNilOrEmpty(errors.modelo)}
            helperText={touched.modelo ? errors.modelo : undefined}
            required
          />
        </div>

        <div>
          <TextField
            className={classes.textbox}
            id="color"
            name="color"
            label="Color del Vehiculo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.color}
            error={touched.color && isNotNilOrEmpty(errors.color)}
            helperText={touched.color ? errors.color : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="placa"
            name="placa"
            label="Placa del Vehiculo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.placa}
            error={touched.placa && isNotNilOrEmpty(errors.placa)}
            helperText={touched.placa ? errors.placa : undefined}
            required
          />
        </div>
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

export default FormIngresarVehiculos;
