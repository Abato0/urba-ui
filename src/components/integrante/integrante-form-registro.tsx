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
import ModalAuth from "../core/input/dialog/modal-dialog";
import { listadoGrupoFamiliar } from "../grupo-familiar/grupo-familiar-typeDefs";
import { parseStringDate } from "../utils/parseDate";
import {
  IIntegranteVariables,
  usePostIntegranteMutation,
  useUpdateIntegranteMutation,
} from "./use-intergrante";

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
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 220,
    },
    form: {
      display: "flex",
      flexDirection: "column",
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
  cedula: "",
  nombre: "",
  apellido: "",
  telefono: "",
  parentesco: "",
  fecha_nacimiento: new Date(),
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  idGrupoFamiliar: yup.number().required(),
  cedula: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Solo numeros")
    .min(10, "El numero debe teenr 10 digitos exactamente")
    .max(10, "El numero debe teenr 10 digitos exactamente")
    .required("Requerido"),
  nombre: yup.string().required(),
  apellido: yup.string().required(),
  telefono: yup
    .string()
    .required()
    .matches(/^[0-9]+$/, "Solo numeros")
    .min(10, "El numero debe teenr 10 digitos exactamente")
    .max(10, "El numero debe teenr 10 digitos exactamente")
    .required("Requerido"),
  parentesco: yup.string().required(),
  fecha_nacimiento: yup.date().required(),
});

interface IProps {
  integrante?: IIntegranteVariables;
}

const IntegranteFormIngresar: FC<IProps> = ({ integrante }) => {
  const init = useMemo(() => {
    return isNotNilOrEmpty(integrante)
      ? {
          idGrupoFamiliar: integrante?.grupoFamiliar.id,
          cedula: integrante?.cedula,
          nombre: integrante?.nombre,
          apellido: integrante?.apellido,
          telefono: integrante?.telefono,
          parentesco: integrante?.parentesco,
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
        apellido,
        cedula,
        fecha_nacimiento,
        nombre,
        parentesco,
        telefono,
      },
      { setSubmitting }
    ) => {
      try {
        if (
          isNotNilOrEmpty(idGrupoFamiliar) &&
          isNotNilOrEmpty(apellido) &&
          isNotNilOrEmpty(cedula) &&
          isNotNilOrEmpty(fecha_nacimiento) &&
          isNotNilOrEmpty(nombre) &&
          isNotNilOrEmpty(parentesco) &&
          isNotNilOrEmpty(telefono)
        ) {
          // const { data, loding, error } = await mutate({
          //   variable: isNotNilOrEmpty(integrante)
          //     ? {
          //         id: integrante?.id,
          //         apellido,
          //         cedula: String(cedula),
          //         fecha_nacimiento,
          //         nombre,
          //         parentesco,
          //         telefono,
          //       }
          //     : {
          //         idGrupoFamiliar,
          //         apellido,
          //         cedula: String(cedula),
          //         fecha_nacimiento,
          //         nombre,
          //         parentesco,
          //         telefono,
          //       },
          // });
          const { data, loading, error } = isNotNilOrEmpty(integrante)
            ? await mutateUpdate({
                variables: {
                  id: integrante?.id,
                  apellido,
                  cedula: String(cedula),
                  fecha_nacimiento,
                  nombre,
                  parentesco,
                  telefono,
                },
              })
            : await mutate({
                variables: {
                  idGrupoFamiliar,
                  apellido,
                  cedula: String(cedula),
                  fecha_nacimiento,
                  nombre,
                  parentesco,
                  telefono,
                },
              });
          if (
            !loading &&
            isNotNilOrEmpty(data) &&
            isNotNilOrEmpty(data.PostIntegrante)
          ) {
            const { message } = data.PostIntegrante;
            setOpenModalMsj(true);
            setTitleModalMsj(message);
          } else if (!loading && data === null) {
            setOpenModalMsj(true);
            setTitleModalMsj("Usuario no autorizado");
          }
        }
      } catch (err: any) {
        console.log("error : ", err);
        setTitleModalMsj("Envio Fallido");
        setMensajeModalMsj("Integrante no ha sido guardado: " + err.message);
        setOpenModalMsj(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [integrante]
  );
  // console.log("integrante:", integrante);

  // const init = useMemo(() => {
  //   console.log("integrante: ",integrante)
  //   return isNotNilOrEmpty(integrante)
  //     ? {
  //         idGrupoFamiliar: integrante?.grupoFamiliar.id,
  //         cedula: integrante?.cedula,
  //         nombre: integrante?.nombre,
  //         apellido: integrante?.apellido,
  //         telefono: integrante?.telefono,
  //         parentesco: integrante?.parentesco,
  //         fecha_nacimiento: new Date(),
  //       }
  //     : initialValues;
  // }, [integrante]);

  // useEffect(() => {
  //   if (isNotNilOrEmpty(integrante)) {
  //     setFieldValue("idGrupoFamiliar", integrante?.grupoFamiliar.id);
  //     setFieldValue("cedula", integrante?.cedula);
  //     setFieldValue("nombre", integrante?.nombre);
  //     setFieldValue("apellido", integrante?.apellido);
  //     setFieldValue("telefono", integrante?.telefono);
  //     setFieldValue("parentesco", integrante?.parentesco);
  //     setFieldValue(
  //       "fecha_nacimiento",
  //       isNotNilOrEmpty(integrante?.fecha_nacimiento)
  //         ? parseStringDate(integrante?.fecha_nacimiento!)
  //         : new Date()
  //     );
  //   }
  // }, [integrante]);

  const {
    errors,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    touched,
    setFieldValue,
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
          <FormControl variant="outlined" className={classes.formControl}>
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
          </FormControl>
          <TextField
            className={classes.textbox}
            id="cedula"
            name="cedula"
            label="Cedula del Integrante"
            onChange={handleChange}
            onBlur={handleBlur}
            // type={"number"}
            value={values.cedula}
            error={touched.cedula && isNotNilOrEmpty(errors.cedula)}
            helperText={touched.cedula ? errors.cedula : undefined}
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
          <TextField
            className={classes.textbox}
            id="telefono"
            name="telefono"
            label="Telefono "
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.telefono}
            error={touched.telefono && isNotNilOrEmpty(errors.telefono)}
            helperText={touched.telefono ? errors.telefono : undefined}
            required
          />
          <TextField
            className={classes.textbox}
            id="parentesco"
            name="parentesco"
            label="Parentesco"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.parentesco}
            error={touched.parentesco && isNotNilOrEmpty(errors.parentesco)}
            helperText={touched.parentesco ? errors.parentesco : undefined}
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.textbox}
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              label="Ingrese Fecha de Nacimiento"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              value={values.fecha_nacimiento}
              // onChange={handleChange}
              onChange={(value) => setFieldValue("fecha_nacimiento", value)}
              error={
                touched.fecha_nacimiento &&
                isNotNilOrEmpty(errors.fecha_nacimiento)
              }
              helperText={
                touched.fecha_nacimiento ? errors.fecha_nacimiento : undefined
              }
              disableFuture={true}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              required
            />
          </MuiPickersUtilsProvider>
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
