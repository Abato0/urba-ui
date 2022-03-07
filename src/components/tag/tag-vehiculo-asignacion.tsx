import {
  makeStyles,
  createStyles,
  colors,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { useFormik } from "formik";
import { isNil } from "ramda";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
//   import { isNotNilOrEmpty } from "../../../utils/is-nil-empty";
//   import ModalAuth from "../../core/input/dialog/modal-dialog";
import { useRouter } from "next/router";
import {
  IResultQueryTag,
  useListaTag,
  useListaTagPagos,
  usePostTagMutation,
  usePostTagVehiculoMutation,
  usePutTagMutation,
} from "./use-tag";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";
import ModalAuth from "../core/input/dialog/modal-dialog";
import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";
import { IVehiculoVariable } from "../vehiculo/use-vehiculo";
import { useListarGrupoFamiliar } from "../grupo-familiar/use-grupo-familia";
import { id } from "date-fns/locale";
import FormControlHeader from "../core/input/form-control-select";
import { SelectHeader } from "../core/input/select/select-header";
import { SelectChangeEvent } from "@mui/material";

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
  idVehiculo: undefined,
  idTag: undefined,
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  // code: yup.string().required("Campo requerido"),
  idVehiculo: yup.number().required(),
  idTag: yup.number().required(),
});

export const IngresarTagVehiculoForm: FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);

  // const [boolPut, setBoolPut] = useState<boolean>(false);

  const { data, loading, error, refetch } = useListaTagPagos();
  const { data: dataTag, loading: loadingTag, error: errorTag } = useListaTag();

  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
    number | undefined
  >();
  const [vehiculo, setVehiculo] = useState<IVehiculoVariable[]>([]);

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorGrupoFamiliar,
  } = useListarGrupoFamiliar();

  useEffect(() => {
    if (!loading && data && data.ListaTagPago && idGrupoFamiliarFilter) {
      // const resultGrupoFamiliar = data.ListaTagPago.map(({})=>{
      // })
      const result = data.ListaTagPago.filter(
        ({ vehiculo }) => vehiculo.grupoFamiliar.id === idGrupoFamiliarFilter
      );
      const vehiculosResult = result.map(({ vehiculo }) => vehiculo);
      setVehiculo(vehiculosResult);
    }
  }, [data, loading, error, idGrupoFamiliarFilter]);

  // useEffect(()=>{
  //   if(!loading)
  // },[loadingTag,dataTag])

  // // useEffect(() => {
  //   // setTimeout(() => {
  //   if (!openModalMsj && boolPut) {
  //     router.push({ pathname: "/mantenimiento/parentesco/listado" });
  //   }
  //   // }, 2000);
  // }, [boolPut, openModalMsj, router]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mutate] = usePostTagVehiculoMutation();
  const onSubmit = useCallback(
    async ({ idVehiculo, idTag }) => {
      try {
        console.log("dasdniosa");
        if (isNotNilOrEmpty(idTag) && isNotNilOrEmpty(idVehiculo)) {
          const { data } = await mutate({
            variables: {
              idVehiculo,
              idTag,
            },
          });

          if (isNotNilOrEmpty(data)) {
            const { code, message } = data.PostTagVehiculo;
            setTitleModalMsj(message);
            setOpenModalMsj(true);
            // if (isNotNilOrEmpty(data.PutTag)) {
            //   setBoolPut(true);
            // }
            if (code === 200) {
              setErrorModal(false);
              await refetch();
            }
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
        setMensajeModalMsj("El tag no ha sido guardado: " + error.message);
        setOpenModalMsj(true);
      }
    },
    [mutate]
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
    setFieldValue,
    resetForm,
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
      <div className={classes.title}>
        <Typography variant="overline">Asignación de Tags</Typography>
      </div>

      <form
        action="#"
        onSubmit={handleSubmit}
        onReset={handleReset}
        className={classes.form}
      >
        <div className={classes.contentLastTextBox}>
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="idGrupoFamiliar_label">Grupo Familiar</InputLabel>
            <Select
              // className={classes.selectFilter}
              labelId="idGrupoFamiliar_label"
              value={idGrupoFamiliarFilter}
              onChange={(e) =>
                setIdGrupoFamiliarFilter(e.target.value as number)
              }
            >
              <MenuItem value={undefined}> - Deseleccionar - </MenuItem>
              {!loadingListadoGrupoFamiliar &&
                isNotNilOrEmpty(dataListadoGrupoFamiliar) &&
                dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                  ({ id, nombre_familiar }) => {
                    return (
                      <MenuItem
                        value={id}
                        key={"ListadoTagFilterGrupoFamiliar" + id}
                      >
                        {nombre_familiar}
                      </MenuItem>
                    );
                  }
                )}
            </Select>
          </FormControl>
        </div>
        <div className={classes.contentLastTextBox}>
          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="idVehiculo"
            handleChange={handleChange}
            labetTitulo="Vehiculo"
            value={values.idVehiculo}
          >
            {vehiculo &&
              vehiculo.map(({ id, placa }) => {
                return (
                  <MenuItem value={id} key={"listadoVehiculoFormTag" + id}>
                    {placa}
                  </MenuItem>
                );
              })}
          </FormControlHeader>

          <FormControlHeader
            classes={classes}
            handleBlur={handleBlur}
            id="idTag"
            handleChange={handleChange}
            labetTitulo="Tag"
            value={values.idTag}
          >
            {!loadingTag &&
              dataTag &&
              isNotNilOrEmpty(dataTag.ListaTag) &&
              dataTag.ListaTag.map(({ code, id }) => {
                return (
                  <MenuItem value={id} key={"listadoVehiculoFormTag" + id}>
                    {code}
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
