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
import React, { useEffect, useState } from "react";
import ModalAuth from "../core/input/dialog/modal-dialog";
import * as yup from "yup";
import { Field, Formik, useFormik } from "formik";

import FormControlHeader from "../core/input/form-control-select";
import { useListarGrupoFamiliar } from "../grupo-familiar/use-grupo-familia";
import { isNotEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";

import {
  useSaveVehiculoMutation,
  useUpdateVehiculoMutation,
} from "./use-vehiculo";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { useListaModeloQuery } from "../mantenimento/modelo/use-modelo";
import { useListaMarcaQuery } from "../mantenimento/marca/use-marca";
import { useListaStatusVehiculoQuery } from "../mantenimento/status-vehiculo/use-status-vehiculo";
import { equals, isNil } from "ramda";
import { useListaColorQuery } from "../mantenimento/color/use-color";

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
      flexDirection: "column",
      justifyContent: "center",
      // alignContent: "center",
      // width: "100%",
      // alignItems: "center",
      padding: theme.spacing(4),
      minWidth: 500,
      backgroundColor: colors.red[400],
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
      fontSize: theme.typography.pxToRem(12),
      backgroundColor: colors.grey[200],
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 5,
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
    buttonCargarFile: {
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(1),
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: colors.grey[500],
      borderRadius: theme.spacing(2),
      padding: theme.spacing(1),
    },
    labelInfoButton: {
      // fontWeight: theme.typography.pxToRem(8),
      fontSize: theme.typography.pxToRem(9),
    },
  })
);

const initialValues = Object.freeze({
  idGrupoFamiliar: 0,
  // tipo_vehiculo: "",
  placa: "",
  id_marca: 0,
  id_color: 0,
  id_modelo: 0,
  id_status: 0,
  matriculaFrontal: null,
  matriculaReverso: null,
  cedulaFrontal: null,
  cedulaReverso: null,
  // matriculaPdf: ""
});

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const validationSchema = yup.object().shape({
  idGrupoFamiliar: yup.number().required("Campo Requerido"),
  // tipo_vehiculo: yup.string().required("Campo Requerido"),
  placa: yup.string().required("Campo Requerido"),
  // .matches(/^([A-Z]{3}[0-9]{3,4})$/, "Formato Invalido. Ej: ABC1234"),
  id_marca: yup.number().required("Campo Requerido"),
  id_color: yup.number().required("Campo Requerido"),
  id_modelo: yup.number().required("Campo Requerido"),
  id_status: yup.number().required("Campo Requerido"),
  matriculaFrontal: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    ),
  matriculaReverso: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    ),
  cedulaFrontal: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    ),
  // .test(
  //   "fileFormat",
  //   "Unsupported Format",
  //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
  // ),
  cedulaReverso: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    ),
  // .test(
  //   "fileFormat",
  //   "Unsupported Format",
  //   (value) => value && SUPPORTED_FORMATS.includes(value.type)
  // ),
});

export interface IVehiculoInputRegistro {
  idGrupoFamiliar: number;
  placa: string;
  id_marca: number;
  id_color: number;
  id_modelo: number;
  id_status: number;
  matriculaFrontal?: File;
  matriculaReverso?: File;
  cedulaFrontal?: File;
  cedulaReverso?: File;
  // matriculaPdf?: string;
}

interface IProps {
  vehiculo?: IVehiculoInputRegistro;
  id?: number;
}

const FormIngresarVehiculos: React.FC<IProps> = ({ vehiculo }) => {
  const classes = useStyles();
  const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = React.useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>("");
  const [errorModal, setErrorModal] = React.useState<boolean>(false);

  const [boolPut, setBoolPut] = React.useState<boolean>(false);

  const {
    data: dataModelo,
    loading: loadingModelo,
    error: errorModelo,
  } = useListaModeloQuery();

  const {
    data: dataMarca,
    loading: loadingMarca,
    error: errorMarca,
  } = useListaMarcaQuery();

  const {
    data: dataStatus,
    loading: loadingStatus,
    error: errorStatus,
  } = useListaStatusVehiculoQuery();

  const {
    data: dataListadoColor,
    loading: loadingListadoColor,
    error: errorListadoColor,
  } = useListaColorQuery();

  const [file, setFile] = React.useState<File>();

  const {
    data: dataGrupoFamiliar,
    loading: loadingGrupoFamiliar,
    error: errorGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const onDrop = React.useCallback(([file]: [File]) => {
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "application/pdf , *.pdf",
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const init = React.useMemo(() => {
    // const {ma} = vehiculo
    if (!isNil(vehiculo)) {
      // const { matriculaPdf, ...props } = vehiculo;
      // console.log("props: ", props);
      return vehiculo;
    } else {
      return initialValues;
    }
  }, [vehiculo]);

  const [mutate] = isNotNilOrEmpty(vehiculo)
    ? useUpdateVehiculoMutation()
    : useSaveVehiculoMutation();

  const router = useRouter();

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      router.push({ pathname: "/vehiculo/listado" });
    }
    // }, 2000);
  }, [boolPut, openModalMsj]);

  const id: number = React.useMemo(() => {
    return Number(router.query.id);
  }, [router.query.id]);

  const onSubmit = React.useCallback(
    async (
      {
        idGrupoFamiliar,
        placa,
        id_marca,
        id_color,
        id_modelo,
        id_status,
        matriculaFrontal,
        matriculaReverso,
        cedulaFrontal,
        cedulaReverso,
      },
      { setSubmitting }
    ) => {
      try {
        if (isNotNilOrEmpty(idGrupoFamiliar) && !equals(idGrupoFamiliar, 0)) {
          const { data, loading, error } = isNotNilOrEmpty(vehiculo)
            ? await mutate({
                variables: {
                  id,
                  // tipo_vehiculo,
                  placa,
                  id_marca,
                  id_color,
                  id_modelo,
                  id_status,
                  matriculaFrontal,
                  matriculaReverso,
                  cedulaFrontal,
                  cedulaReverso,
                },
              })
            : await mutate({
                variables: {
                  idGrupoFamiliar,
                  // tipo_vehiculo,
                  placa,
                  id_marca,
                  id_color,
                  id_modelo,
                  id_status,
                  matriculaFrontal,
                  matriculaReverso,
                  cedulaFrontal,
                  cedulaReverso,
                },
              });

          if (!loading && isNotNilOrEmpty(data)) {
            const { message } = isNotNilOrEmpty(data.PostVehiculo)
              ? data.PostVehiculo
              : data.UpdateVehiculo;

            console.log("data:", data);
            setErrorModal(false);
            setOpenModalMsj(true);
            setTitleModalMsj(message);
            if (isNotNilOrEmpty(data.UpdateVehiculo)) {
              setBoolPut(true);
            }

            resetForm();
          } else if (!loading && data === null) {
            setOpenModalMsj(true);
            setTitleModalMsj("Usuario no autorizado");
            setErrorModal(true);
          }
        }
      } catch (error: any) {
        console.log("error : ", error);
        setTitleModalMsj("Registro Fallido");
        setMensajeModalMsj(
          "El registro del vehiculo no se ha realizado: " + error.message
        );
        setOpenModalMsj(true);
        setErrorModal(true);
      }
    },
    [file]
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
        <Typography variant="overline">Registro de Vehiculos</Typography>
      </div>
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
            disabled={isNotNilOrEmpty(vehiculo)}
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
            inputProps={{ style: { textTransform: "uppercase" } }}
          />
        </div>

        <div>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="id_marca"
            handleChange={handleChange}
            labetTitulo="Marca"
            value={values.id_marca}
          >
            {!loadingMarca &&
              !isNil(dataMarca) &&
              dataMarca.ListaMarca.map(({ id, marca }) => {
                return (
                  <MenuItem key={"ingreso-vehiculo-marca-" + id} value={id}>
                    {marca}
                  </MenuItem>
                );
              })}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="id_modelo"
            handleChange={handleChange}
            labetTitulo="Modelo"
            value={values.id_modelo}
          >
            {!loadingModelo &&
              !isNil(dataModelo) &&
              dataModelo.ListaModelo.map(({ id, modelo }) => {
                return (
                  <MenuItem key={"ingreso-vehiculo-modelo-" + id} value={id}>
                    {modelo}
                  </MenuItem>
                );
              })}
          </FormControlHeader>
        </div>

        <div>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="id_color"
            handleChange={handleChange}
            labetTitulo="Color"
            value={values.id_color}
          >
            {!loadingListadoColor &&
              !isNil(dataListadoColor) &&
              dataListadoColor.ListaColor.map(({ id, color }) => {
                return (
                  <MenuItem key={"ingreso-vehiculo-color-" + id} value={id}>
                    {color}
                  </MenuItem>
                );
              })}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="id_status"
            handleChange={handleChange}
            labetTitulo="Status"
            value={values.id_status}
          >
            {!loadingStatus &&
              !isNil(dataStatus) &&
              dataStatus.ListaStatusVehiculo.map(({ id, statusVehiculo }) => {
                return (
                  <MenuItem
                    key={"ingreso-vehiculo-statusVehiculo-" + id}
                    value={id}
                  >
                    {statusVehiculo}
                  </MenuItem>
                );
              })}
          </FormControlHeader>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <div className={classes.buttonCargarFile}>
              <Button
                style={{ margin: 10, width: 120 }}
                variant="outlined"
                component="label"
              >
                Matricula frontal
                <input
                  type="file"
                  id="matriculaFrontal"
                  name="matriculaFrontal"
                  onChange={(event: any) => {
                    setFieldValue(
                      "matriculaFrontal",
                      event.currentTarget.files[0]
                    );
                  }}
                  accept="image/*"
                  hidden
                />
              </Button>
              <div style={{ maxWidth: 150 }}>
                <Typography variant="caption">
                  {values.matriculaFrontal &&
                  values.matriculaFrontal.size > FILE_SIZE
                    ? "Matricula Frontal tamaño no soportado debe ser menor a 160KB"
                    : values.matriculaFrontal &&
                      values.matriculaFrontal.size <= FILE_SIZE
                    ? "Matricula frontal cargada"
                    : "Matricula frontal no cargada"}
                </Typography>
              </div>
            </div>

            <div className={classes.buttonCargarFile}>
              <Button
                style={{ margin: 10, width: 120 }}
                variant="outlined"
                component="label"
              >
                Matricula reverso
                <input
                  type="file"
                  id="matriculaReverso"
                  name="matriculaReverso"
                  onChange={(event: any) => {
                    setFieldValue(
                      "matriculaReverso",
                      event.currentTarget.files[0]
                    );
                  }}
                  accept="image/*"
                  hidden
                />
              </Button>
              <div style={{ maxWidth: 150 }}>
                <Typography variant="caption">
                  {values.matriculaReverso &&
                  values.matriculaReverso.size > FILE_SIZE
                    ? "Matricula Reverso tamaño no soportado debe ser menor a 160KB"
                    : values.matriculaReverso &&
                      values.matriculaReverso.size <= FILE_SIZE
                    ? "Matricula Reverso cargada"
                    : "Matricula Reverso no cargada"}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div className={classes.buttonCargarFile}>
            <Button
              style={{ margin: 10, width: 120 }}
              variant="outlined"
              component="label"
            >
              Cedula frontal
              <input
                type="file"
                id="cedulaFrontal"
                name="cedulaFrontal"
                onChange={(event: any) => {
                  setFieldValue("cedulaFrontal", event.currentTarget.files[0]);
                }}
                accept="image/*"
                hidden
              />
            </Button>
            <div style={{ maxWidth: 150 }}>
              <Typography variant="caption">
                {values.cedulaFrontal && values.cedulaFrontal.size > FILE_SIZE
                  ? "Cedula Frontal tamaño no soportado debe ser menor a 160KB"
                  : values.cedulaFrontal &&
                    values.cedulaFrontal.size <= FILE_SIZE
                  ? "Cedula frontal cargada"
                  : "Cedula frontal no cargada"}
              </Typography>
            </div>
          </div>
          <div className={classes.buttonCargarFile}>
            <Button
              style={{ margin: 10, width: 120 }}
              variant="outlined"
              component="label"
            >
              Cedula reverso
              <input
                type="file"
                id="cedulaReverso"
                name="cedulaReverso"
                onChange={(event: any) => {
                  setFieldValue("cedulaReverso", event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
                accept="image/*"
                hidden
              />
            </Button>
            <div style={{ maxWidth: 150 }}>
              <Typography variant="caption">
                {values.cedulaReverso && values.cedulaReverso.size > FILE_SIZE
                  ? "Cedula Reverso tamaño no soportado debe ser menor a 160KB"
                  : values.cedulaReverso &&
                    values.cedulaReverso.size <= FILE_SIZE
                  ? "Cedula Reverso cargada"
                  : "Cedula Reverso no cargada"}
              </Typography>
            </div>
          </div>
        </div>
        {/* </div> */}

        {/* {JSON.stringify(touched)}
        {"error: " + errorMessage} */}

        {/* <Paper {...getRootProps()} className={classes.dropzone}>
          <input {...getInputProps()} />
          <PictureAsPdfIcon fontSize="large" />
          <Typography variant="overline">
            {"Haga click en este cuadro para subir archivo pfg"}
          </Typography>
          {isNotNilOrEmpty(file) && (
            <Typography variant="body2">
              {" "}
              {" *" + String(file?.path)}
            </Typography>
          )}
        </Paper> */}

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
