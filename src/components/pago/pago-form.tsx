import { useQuery } from "@apollo/client";
import { addMonths, eachMonthOfInterval, lightFormat } from "date-fns";
import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Button,
} from "@material-ui/core";
import { useFormik } from "formik";
import { dropLast, isEmpty, isNil, join, split, tail } from "ramda";
import React from "react";
import { useDropzone } from "react-dropzone";
import * as yup from "yup";
import {
  isNotNilOrEmpty,
  isNilOrEmpty,
  isNotNil,
} from "../../utils/is-nil-empty";
import {
  IAporteVariables,
  useArrIntervaloFechaAporte,
  useListarAporteQuery,
} from "../aporte/use-aporte";
import ModalAuth from "../core/input/dialog/modal-dialog";
import { listadoGrupoFamiliar } from "../grupo-familiar/grupo-familiar-typeDefs";
import { anos, meses } from "./pago-utils";
import { usePostPago } from "./use-pago";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { grey } from "@material-ui/core/colors";

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
      margin: theme.spacing(1),
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
    textbox_descripcion: {
      margin: theme.spacing(1),
      width: theme.spacing(60),
    },
    dropzone: {
      padding: theme.spacing(4),
      minWidth: 500,
      backgroundColor: grey[700],
      color: "white",
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
  })
);

const initialValues = Object.freeze({
  idGrupoFamiliar: undefined,
  descripcion: "",
  monto: 0,
  id_aporte: undefined,
  fecha_pago: "",
  cod_recibo: "",
  fecha_recibo: new Date(),
});

const validationSchema = yup.object().shape({
  id_aporte: yup.number().required(),
  idGrupoFamiliar: yup.number().required(),
  descripcion: yup.string(),
  monto: yup.number().required(),
  fecha_pago: yup.string().required(),
  cod_recibo: yup.string().required(),
  fecha_recibo: yup.date().required(),
});

export const PagoFormIngresar = () => {
  const [file, setFile] = React.useState<File>();
  const onSubmit = React.useCallback(
    async (
      {
        idGrupoFamiliar,
        descripcion,
        monto,
        id_aporte,
        fecha_pago,
        cod_recibo,
        fecha_recibo,
      },
      { setSubmitting }
    ) => {
      try {
        if (
          isNotNilOrEmpty(idGrupoFamiliar) &&
          isNotNilOrEmpty(monto) &&
          isNotNilOrEmpty(id_aporte) &&
          isNotNilOrEmpty(fecha_pago) &&
          isNotNilOrEmpty(cod_recibo) &&
          isNotNilOrEmpty(fecha_recibo) &&
          isNotNilOrEmpty(file)
        ) {
          const pago = {
            idGrupoFamiliar: idGrupoFamiliar,
            idAporte: id_aporte,
            imagen_recibo: file!,
            fecha_subida: new Date(),
            fecha_pago: fecha_pago,
            descripcion: descripcion,
            monto: monto,
            cod_recibo: cod_recibo,
            fecha_recibo: fecha_recibo,
          };
          const { data, loading, error } = await mutate({
            variables: { ...pago },
          });
          if (
            !loading &&
            isNotNilOrEmpty(data) &&
            isNotNilOrEmpty(data.PostPago)
          ) {
            const { message } = data.PostPago;
            setOpenModalMsj(true);
            setTitleModalMsj(message);
          } else if (!loading && data === null) {
            setOpenModalMsj(true);
            setTitleModalMsj("Usuario no autorizado");
          }
        } else {
          // console.log(
          //   "idGrupoFamiliar",
          //   idGrupoFamiliar,
          //   "mes_pago",
          //   mes_pago,
          //   "ano_pago",
          //   ano_pago,
          //   "monto",
          //   monto,
          //   "tipo_aporte",
          //   tipo_aporte,
          //   "file",
          //   file
          // );
        }
      } catch (err) {
        console.log("error : ", err);
        setTitleModalMsj("Pago Fallido");
        setMensajeModalMsj("Pago no se ha realizado el pago: " + err.message);
        setOpenModalMsj(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
    isSubmitting,
    touched,
    values,
  } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const { data, loading, error } = useQuery(listadoGrupoFamiliar, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const {
    data: dataListarAporte,
    loading: loadingListarAporte,
    error: errorListarAporte,
  } = useListarAporteQuery();

  // const {
  //   data: dataArrFecha,
  //   loading: loadingArrFecha,
  //   error: errorArrFecha,
  // } = useArrIntervaloFechaAporte(values.idGrupoFamiliar);

  // React.useEffect(() => {
  //   if (!loadingArrFecha) {
  //     console.log("dataArr: ", dataArrFecha);
  //   }
  // }, [values.idGrupoFamiliar]);

  const [dataGrupoFamiliar, setDataGrupoFamiliar] = React.useState([]);
  const [dataListaAporte, setListaAporte] = React.useState<IAporteVariables[]>(
    []
  );

  const [mutate] = usePostPago();
  const [openModalMsj, setOpenModalMsj] = React.useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = React.useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = React.useState<string>("");
  const [aporteSeleccionado, setAporteSeleccionado] =
    React.useState<IAporteVariables>();
  // const [idAporteSeleccionado,setIdAporte]

  const onDrop = React.useCallback(([file]: [File]) => {
    // Do something with the files
    // console.log("accept: ", head(acceptedFiles));
    // console.log("");
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg , image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  });

  const MesInput = () => {
    const acum: any[] = [];
    for (let index = 0; index < meses.length; index++) {
      acum.push(<MenuItem value={index}>{meses[index]}</MenuItem>);
    }
    return acum;
  };

  const AnosInput = () => {
    const acum: any[] = [];
    for (let index = 0; index < anos.length; index++) {
      acum.push(<MenuItem value={anos[index]}>{anos[index]}</MenuItem>);
    }
    return acum;
  };

  React.useEffect(() => {
    if (!loading && !isNil(data)) {
      setDataGrupoFamiliar(data.ListaGruposFamiliares);
      console.log("data: ", data.ListaGruposFamiliares);
    }
  }, [loading]);

  React.useEffect(() => {
    if (!loadingListarAporte && !isNil(dataListarAporte)) {
      setListaAporte(dataListarAporte.ListaAportes);
      // setFieldValue("monto",)
      console.log("data: ", dataListarAporte.ListaAportes);
    }
  }, [loadingListarAporte]);

  React.useEffect(() => {
    if (isNotNilOrEmpty(values.id_aporte) && isNotNilOrEmpty(dataListaAporte)) {
      const result = dataListaAporte.find(
        (aporte) => aporte.id === values.id_aporte
      );
      setFieldValue("monto", result?.valor_mensual);
      setAporteSeleccionado(result);
    }
  }, [values.id_aporte]);

  const MenuItemArrFecha = (arrString: string[]) => {
    const acum: any[] = [];
    for (let index = 0; index < arrString.length; index++) {
      acum.push(
        <MenuItem value={arrString[index]}>
          {join("-", dropLast(1, split("-", arrString[index])))}
        </MenuItem>
      );
    }
    return acum;
  };

  const parseStringDate = (date: string) => {
    if (!isEmpty(date)) {
      const arrString = date.split("-");
      return new Date(
        Number(arrString[0]),
        Number(arrString[1]) - 1,
        Number(arrString[2])
      );
    }
  };

  const rangoFechaAportePagoService = (aporte: IAporteVariables) => {
    const { fecha_inicio, fecha_fin } = aporte;
    const arrDate = eachMonthOfInterval({
      start: parseStringDate(fecha_inicio)!,
      end: parseStringDate(fecha_fin)!,
    });

    const arrDateString = arrDate.map((date) => {
      return lightFormat(date, "yyyy-MM-dd");
    });
    return arrDateString;
  };

  const arrFecha = React.useMemo(() => {
    if (isNotNilOrEmpty(aporteSeleccionado)) {
      console.log("arrFecha: ");
      return rangoFechaAportePagoService(aporteSeleccionado!);
    }
  }, [aporteSeleccionado]);

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
      <Typography variant="h5"> Ingreso de Pago</Typography>
      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div>
          <FormControl  className={classes.formControl}>
            <InputLabel id="idGrupoFamiliar_label">
              Grupo Familiar del Deposito
            </InputLabel>
            <Select
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
              {!loading &&
                dataGrupoFamiliar &&
                dataGrupoFamiliar.map(({ id, nombre_familiar }) => {
                  return <MenuItem value={id}>{nombre_familiar}</MenuItem>;
                })}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="aporte_label">Seleccione Aporte</InputLabel>
            <Select
              labelId="aporte_label"
              id="id_aporte"
              name="id_aporte"
              value={values.id_aporte}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              {dataListaAporte &&
                dataListaAporte.map(({ id, nombre_aporte, tipo_aporte }) => {
                  return (
                    <MenuItem
                      value={id}
                    >{`${nombre_aporte} - ${tipo_aporte}`}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          {/* <FormControl className={classes.formControl}>
            <InputLabel id="tipo_aporte_label">Tipo de Aporte</InputLabel>
            <Select
              labelId="tipo_aporte_label"
              id="tipo_aporte"
              name="tipo_aporte"
              value={values.tipo_aporte}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              <MenuItem value={"implementacion"}>Implementacion</MenuItem>
              <MenuItem value={"mantenimiento"}>Mantenimiento</MenuItem>
            </Select>
          </FormControl> */}
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="fecha_pago_label">Seleccione Fecha</InputLabel>
            <Select
              labelId="fecha_pago_label"
              id="fecha_pago"
              name="fecha_pago"
              value={values.fecha_pago}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              {
                isNotNilOrEmpty(arrFecha) && MenuItemArrFecha(arrFecha!)
                // arrFecha?.map((date) => {
                //   return <MenuItem value={date}>{date}</MenuItem>;
                // })
              }

              {/* {dataListaAporte &&
                dataListaAporte.map(({ id, nombre_aporte, tipo_aporte }) => {
                  return (
                    <MenuItem
                      value={id}
                    >{`${nombre_aporte} - ${tipo_aporte}`}</MenuItem>
                  );
                })} */}
            </Select>
          </FormControl>
          <TextField
            className={classes.textbox}
            id="monto"
            name="monto"
            label="Monto del Deposito"
            onChange={handleChange}
            onBlur={handleBlur}
            type={"number"}
            value={values.monto}
            error={touched.monto && isNotNilOrEmpty(errors.monto)}
            helperText={touched.monto ? errors.monto : undefined}
            required
          />
        </div>

        <div>
          <TextField
            className={classes.textbox}
            id="cod_recibo"
            name="cod_recibo"
            label="Codigo del Recibo"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.cod_recibo}
            error={touched.cod_recibo && isNotNilOrEmpty(errors.cod_recibo)}
            helperText={touched.cod_recibo ? errors.cod_recibo : undefined}
            required
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.textbox}
              id="fecha_recibo"
              name="fecha_recibo"
              label="Ingrese Fecha del Recibo"
              inputVariant="outlined"
              format="MM/dd/yyyy"
              value={values.fecha_recibo}
              // onChange={handleChange}
              onChange={(value) => setFieldValue("fecha_recibo", value)}
              error={
                touched.fecha_recibo && isNotNilOrEmpty(errors.fecha_recibo)
              }
              helperText={
                touched.fecha_recibo ? errors.fecha_recibo : undefined
              }
              disableFuture={true}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
              required
            />
          </MuiPickersUtilsProvider>
        </div>

        <div>
          <TextField
            className={classes.textbox_descripcion}
            id="descripcion"
            name="descripcion"
            label="Descripcion (Opcional)"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.descripcion}
            error={touched.descripcion && isNotNilOrEmpty(errors.descripcion)}
            helperText={touched.descripcion ? errors.descripcion : undefined}
          />
        </div>
        {/* <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="mes_pago_label">Mes de Pago</InputLabel>
            <Select
              labelId="mes_pago_label"
              id="mes_pago"
              name="mes_pago"
              value={values.mes_pago}
              onChange={handleChange}
              required
            >
              {MesInput()}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="ano_pago_label">Año de Pago</InputLabel>
            <Select
              labelId="ano_pago_label"
              id="ano_pago"
              name="ano_pago"
              value={values.ano_pago}
              onChange={handleChange}
              required
            >
              {AnosInput()}
            </Select>
          </FormControl>
        </div> */}

        <Paper {...getRootProps()} className={classes.dropzone}>
          <input {...getInputProps()} />
          <Typography variant="overline">
            {"Haga click en este Cuadro para subir su imagen del recibo"}
          </Typography>
          {!isNilOrEmpty(file) && (
            <Typography variant="body2">
              {" "}
              {" *" + String(file?.path)}
            </Typography>
          )}
        </Paper>

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

export default PagoFormIngresar;
