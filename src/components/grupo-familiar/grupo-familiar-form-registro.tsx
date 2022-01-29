import * as yup from "yup";
import {
  makeStyles,
  createStyles,
  colors,
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import {
  calleInterseccion,
  CallesPrincipales,
  coloresPrincipalesFachada,
  manzanas,
  tiposEdificacion,
} from "../core/input/dateSelect";
import FormControlHeader from "../core/input/form-control-select";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // display: "flex",
      // backgroundColor:"red",
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      marginLeft: theme.spacing(10),
      marginRight: theme.spacing(10),
      padding: "60px",
      // minWidth: "820px",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "white",
      // width:600,
      // justifyContent: "center",
      // alignContent: "center"
      // minWidth:600
      // width:"100px"
    },

    form: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",

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
    formControl: {
      // margin: theme.spacing(1),
      minWidth: 220,
    },
  })
);

const initialValues = Object.freeze({
  nombre_familiar: "",
  calle_principal: "",
  calle_interseccion: "",
  manzana: "",
  villa: 0,
  tipo_edificacion: "",
  color_fachada: "",
});

const validationSchema = yup.object().shape({
  nombre_familiar: yup.string().required("Requerido"),
  manzana: yup.string().required("Requerido"),
  villa: yup.number().required("Requerido"),
  calle_principal: yup.string().required("Requerido"),
  calle_interseccion: yup.string().required("Requerido"),
  color_fachada: yup.string().required("Requerido"),
  tipo_edificacion: yup.string().required("Requerido"),
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
        celular: "",
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
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (
      {
        nombre_familiar,
        calle_principal,
        calle_interseccion,
        manzana,
        villa,
        tipo_edificacion,
        color_fachada,
      },
      { setSubmitting }
    ) => {
      try {
        if (
          isNotNilOrEmpty(nombre_familiar) &&
          isNotNilOrEmpty(calle_principal) &&
          isNotNilOrEmpty(calle_interseccion) &&
          isNotNilOrEmpty(manzana) &&
          isNotNilOrEmpty(villa) &&
          isNotNilOrEmpty(tipo_edificacion) &&
          isNotNilOrEmpty(color_fachada)
        ) {
          const {
            data: dataMutate,
            loading: loadingMutate,
            error,
          } = isNil(grupoFam)
            ? await mutate({
                variables: {
                  nombre_familiar,
                  calle_principal,
                  calle_interseccion,
                  manzana,
                  villa,
                  tipo_edificacion,
                  color_fachada,
                },
              })
            : await mutate({
                variables: {
                  id: Number(grupoFam.id),
                  nombre_familiar,
                  calle_principal,
                  calle_interseccion,
                  manzana,
                  villa,
                  tipo_edificacion,
                  color_fachada,
                },
              });
          if (
            (!loadingMutate &&
              isNotNilOrEmpty(dataMutate) &&
              isNotNilOrEmpty(dataMutate.PostGrupoFamiliar)) ||
            isNotNilOrEmpty(dataMutate.UpdateGrupoFamiliar)
          ) {
            const { message } = isNotNilOrEmpty(dataMutate.PostGrupoFamiliar)
              ? dataMutate.PostGrupoFamiliar
              : dataMutate.UpdateGrupoFamiliar;
            setTitleModalMsj(message);
            setErrorModal(false);
            // setMensajeModalMsj(dataMutate.message);
            setOpenModalMsj(true);

            resetForm();
          } else if (!loadingMutate && dataMutate === null) {
            setOpenModalMsj(true);
            setTitleModalMsj("Usuario no autorizado");
          }
        }
        // console.log("data: ", data, "loading: ", loading, "error: ", error);
      } catch (err) {
        // console.log("error : ", err);
        setTitleModalMsj("Grupo Familiar no Registrado");
        setErrorModal(true);
        // setMensajeModalMsj(
        //   "Ha ocurrido un erro al resgistrar el grupo familiar: "
        // );
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
    resetForm,
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
          error={errorModal}
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

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="tipo_edificacion"
            handleChange={handleChange}
            labetTitulo="Tipo de Edificación"
            value={values.tipo_edificacion}
          >
            {tiposEdificacion.map(({ label, value }) => {
              return (
                <MenuItem key={"grupoFamiliar-" + value} value={value}>
                  {label}
                </MenuItem>
              );
            })}
          </FormControlHeader>
        </div>

        <div className={classes.contentLastTextBox}>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="calle_principal"
            handleChange={handleChange}
            labetTitulo="Calle Principal"
            value={values.calle_principal}
          >
            {CallesPrincipales.map((calle_principal) => {
              return (
                <MenuItem
                  key={"grupoFamiliar-" + calle_principal}
                  value={calle_principal}
                >
                  {calle_principal}
                </MenuItem>
              );
            })}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="calle_interseccion"
            handleChange={handleChange}
            labetTitulo="Calle Intersección"
            value={values.calle_interseccion}
          >
            {calleInterseccion.map((calleInterseccion) => {
              return (
                <MenuItem
                  key={"grupoFamiliar-" + calleInterseccion}
                  value={calleInterseccion}
                >
                  {calleInterseccion}
                </MenuItem>
              );
            })}
          </FormControlHeader>
        </div>

        <div className={classes.contentLastTextBox}>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="manzana"
            handleChange={handleChange}
            labetTitulo="Manzana"
            value={values.manzana}
          >
            {manzanas.map((manzana) => {
              return (
                <MenuItem key={"grupoFamiliar-" + manzana} value={manzana}>
                  {manzana}
                </MenuItem>
              );
            })}
          </FormControlHeader>

          <TextField
            className={classes.textbox}
            variant="outlined"
            id="villa"
            value={values.villa}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="villa"
            label="Numero de lote (Villa)"
            margin="normal"
            type={"number"}
            error={touched.villa && isNotNilOrEmpty(errors.villa)}
            helperText={touched.villa ? errors.villa : undefined}
            required
          />
        </div>
        <div
          style={{ marginRight: 245 }}
          className={classes.contentLastTextBox}
        >
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="color_fachada"
            handleChange={handleChange}
            labetTitulo="Color de la Fachada"
            value={values.color_fachada}
          >
            {coloresPrincipalesFachada.map((color) => {
              return (
                <MenuItem key={"grupoFamiliar-" + color} value={color}>
                  {color}
                </MenuItem>
              );
            })}
          </FormControlHeader>
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
