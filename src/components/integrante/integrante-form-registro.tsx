import { useQuery } from "@apollo/client";
import DateFnsUtils from "@date-io/date-fns";
import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useFormik } from "formik";
import { isNil, omit } from "ramda";
import { FC, useCallback, useEffect, useState, useMemo } from "react";
import * as yup from "yup";
import { isNotNilOrEmpty, isNilOrEmpty } from "../../utils/is-nil-empty";
import {
  plantaEdificacion,
  status_integrante,
  tipoDocumentosIdentidad,
} from "../core/input/dateSelect";
import ModalAuth from "../core/input/dialog/modal-dialog";
import FormControlDate from "../core/input/form-control-date";
import FormControlHeader from "../core/input/form-control-select";
import { listadoGrupoFamiliar } from "../grupo-familiar/grupo-familiar-typeDefs";
import {
  IIntegranteVariables,
  usePostIntegranteMutation,
  useUpdateIntegranteMutation,
} from "./use-intergrante";

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
  })
);

const initialValues = Object.freeze({
  idGrupoFamiliar: undefined,
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  status: "",
  fecha_nacimiento: new Date(),
  tipo_doc_identidad: "",
  num_doc_identidad: "",
  piso_ocupa: "",
  genero: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  idGrupoFamiliar: yup.number().required("Campo requerido"),
  tipo_doc_identidad: yup.string().required("Campo requerido"),
  num_doc_identidad: yup
    .string()
    .matches(/^[0-9]+$/, "Solo numeros")
    .min(10, "La cantidad de digitos debe ser mayor o igual 10 ")
    .max(15, "La cantidad de digitos debe ser menor o igual 15 ")
    .required("Campo requerido"),
  nombre: yup.string().required("Campo requerido"),
  apellido: yup.string().required("Campo requerido"),
  telefono: yup
    .string()
    .matches(/^[0][0-9]+$/, "Solo numeros")
    .min(10, "La cantidad de digitos debe ser igual 10 ")
    .max(10, "La cantidad de digitos debe ser igual 10 ")
    .required("Campo requerido"),
  email: yup.string().email("Campo debe ser un correo electronico").nullable(),
  status: yup.string().required("Campo requerido"),
  piso_ocupa: yup.string().required("Campo requerido"),
  genero: yup.string().required("Campo requerido"),
  fecha_nacimiento: yup.date().required("Campo requerido"),
});

interface IProps {
  integrante?: IIntegranteVariables;
}

const IntegranteFormIngresar: FC<IProps> = ({ integrante }) => {
  const init = useMemo(() => {
    return isNotNilOrEmpty(integrante)
      ? {
          idGrupoFamiliar: integrante?.grupoFamiliar.id,
          tipo_doc_identidad: integrante?.tipo_doc_identidad,
          num_doc_identidad: integrante?.num_doc_identidad,
          nombre: integrante?.nombre,
          apellido: integrante?.apellido,
          telefono: integrante?.telefono,
          email: integrante?.email,
          genero: integrante?.genero,
          piso_ocupa: integrante?.piso_ocupa,
          status: integrante?.status,
          fecha_nacimiento: isNotNilOrEmpty(integrante?.fecha_nacimiento)
            ? parseStringDate(integrante?.fecha_nacimiento!)
            : new Date(),
        }
      : initialValues;
  }, [integrante]);
  const classes = useStyles();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const {
    data: dataListaGrupoFamiliar,
    loading: loadingListaGrupoFamiliar,
    error: errorListaGrupoFamiliar,
  } = useQuery(listadoGrupoFamiliar, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const [mutate, data, loading, error] = usePostIntegranteMutation();

  const [mutateUpdate] = useUpdateIntegranteMutation();

  const [dataGrupoFamiliar, setDataGrupoFamiliar] = useState([]);

  useEffect(() => {
    if (!loadingListaGrupoFamiliar && !isNil(dataListaGrupoFamiliar)) {
      setDataGrupoFamiliar(dataListaGrupoFamiliar.ListaGruposFamiliares);
      console.log("data: ", dataListaGrupoFamiliar.ListaGruposFamiliares);
    }
  }, [loadingListaGrupoFamiliar]);

  const onSubmit = useCallback(
    async (
      {
        idGrupoFamiliar,
        nombre,
        apellido,
        telefono,
        status,
        fecha_nacimiento,
        tipo_doc_identidad,
        num_doc_identidad,
        piso_ocupa,
        genero,
        email,
      },
      { setSubmitting }
    ) => {
      try {
        if (
          isNotNilOrEmpty(idGrupoFamiliar) &&
          isNotNilOrEmpty(apellido) &&
          isNotNilOrEmpty(num_doc_identidad) &&
          isNotNilOrEmpty(fecha_nacimiento) &&
          isNotNilOrEmpty(nombre) &&
          isNotNilOrEmpty(status) &&
          isNotNilOrEmpty(telefono) &&
          isNotNilOrEmpty(tipo_doc_identidad) &&
          isNotNilOrEmpty(piso_ocupa) &&
          isNotNilOrEmpty(genero)
        ) {
          const {
            data: dataMutate,
            loading: loadingMutate,
            error,
          } = isNotNilOrEmpty(integrante)
            ? await mutateUpdate({
                variables: {
                  id: integrante?.id,
                  idGrupoFamiliar,
                  nombre,
                  apellido,
                  telefono,
                  status,
                  fecha_nacimiento,
                  tipo_doc_identidad,
                  num_doc_identidad,
                  piso_ocupa,
                  genero,
                  email,
                },
              })
            : await mutate({
                variables: {
                  idGrupoFamiliar,
                  nombre,
                  apellido,
                  telefono,
                  status,
                  fecha_nacimiento,
                  tipo_doc_identidad,
                  num_doc_identidad,
                  piso_ocupa,
                  genero,
                  email,
                },
              });
          if (
            !loadingMutate &&
            isNotNilOrEmpty(dataMutate) &&
            isNotNilOrEmpty(dataMutate.PostIntegrante)
          ) {
            const { message } = dataMutate.PostIntegrante;
            setTitleModalMsj(message);
            setErrorModal(false);
            setOpenModalMsj(true);

            resetForm();
          } else if (!loadingMutate && dataMutate === null) {
            setTitleModalMsj("Usuario no autorizado");
            setErrorModal(true);
            setOpenModalMsj(true);
          }
        }
      } catch (err: any) {
        console.log("error : ", err);
        setTitleModalMsj("Envio Fallido");
        setErrorModal(true);
        setMensajeModalMsj("Integrante no ha sido guardado: " + err.message);
        setOpenModalMsj(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [integrante]
  );

  const resetValues = () => {};

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
      <Typography variant="h5">
        {" "}
        Registro de Integrante de las Familias
      </Typography>
      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div className={classes.contentLastTextBox}>
          {/* <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="idGrupoFamiliar_label">
              Grupo Familiar del Deposito
            </InputLabel>
            <Select
              className={classes.textbox}
              labelId="idGrupoFamiliar_label"
              id="idGrupoFamiliar"
              name="idGrupoFamiliar"
              value={values.idGrupoFamiliar}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.idGrupoFamiliar &&
                isNotNilOrEmpty(errors.idGrupoFamiliar)
              }
              required
            >
              {!loadingListaGrupoFamiliar &&
                dataGrupoFamiliar &&
                dataGrupoFamiliar.map(({ id, nombre_familiar }) => {
                  return <MenuItem value={id}>{nombre_familiar}</MenuItem>;
                })}
            </Select>
          </FormControl> */}

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
            id="status"
            handleChange={handleChange}
            labetTitulo="Condición de habitación"
            value={values.status}
          >
            {status_integrante.map((status) => {
              return (
                <MenuItem key={"integrante-" + status} value={status}>
                  {status}
                </MenuItem>
              );
            })}
          </FormControlHeader>
        </div>

        <div className={classes.contentLastTextBox}>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="tipo_doc_identidad"
            handleChange={handleChange}
            labetTitulo="Tipo de identificacion"
            value={values.tipo_doc_identidad}
          >
            {tipoDocumentosIdentidad.map((tipo) => {
              return (
                <MenuItem key={"integrante-" + tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              );
            })}
          </FormControlHeader>

          <TextField
            className={classes.textbox}
            id="num_doc_identidad"
            name="num_doc_identidad"
            label="Numero de identidad"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.num_doc_identidad}
            error={
              touched.num_doc_identidad &&
              isNotNilOrEmpty(errors.num_doc_identidad)
            }
            helperText={
              touched.num_doc_identidad ? errors.num_doc_identidad : undefined
            }
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            id="nombre"
            name="nombre"
            label="Nombres del Integrante"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.nombre}
            error={touched.nombre && isNotNilOrEmpty(errors.nombre)}
            helperText={touched.nombre ? errors.nombre : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="apellido"
            name="apellido"
            label="Apellidos del Integrante"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.apellido}
            error={touched.apellido && isNotNilOrEmpty(errors.apellido)}
            helperText={touched.apellido ? errors.apellido : undefined}
            required
          />
        </div>

        <div className={classes.contentLastTextBox}>
          <FormControlDate
            classes={classes}
            id="fecha_nacimiento"
            disableFuture={true}
            setFieldValue={setFieldValue}
            error={errors.fecha_nacimiento}
            touched={touched.fecha_nacimiento}
            labelTitulo={"Ingrese Fecha de Nacimiento"}
            value={values.fecha_nacimiento}
          />

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="genero"
            handleChange={handleChange}
            labetTitulo="Genero"
            value={values.genero}
          >
            <MenuItem value={"masculino"}> Masculino</MenuItem>
            <MenuItem value={"femenino"}> Femenino </MenuItem>
            <MenuItem value={"otro"}> Otro</MenuItem>
          </FormControlHeader>
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            id="telefono"
            name="telefono"
            label="Numero celular"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.telefono}
            error={touched.telefono && isNotNilOrEmpty(errors.telefono)}
            helperText={touched.telefono ? errors.telefono : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="email"
            name="email"
            label="Email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            type="email"
            error={touched.email && isNotNilOrEmpty(errors.email)}
            helperText={touched.email ? errors.email : undefined}
          />
        </div>
        <div
          style={{ marginRight: 245 }}
          className={classes.contentLastTextBox}
        >
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="piso_ocupa"
            handleChange={handleChange}
            labetTitulo="Piso que ocupa"
            value={values.piso_ocupa}
          >
            {plantaEdificacion.map((planta) => {
              return (
                <MenuItem key={"integrante-" + planta} value={planta}>
                  {planta}
                </MenuItem>
              );
            })}
          </FormControlHeader>
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

export default IntegranteFormIngresar;
