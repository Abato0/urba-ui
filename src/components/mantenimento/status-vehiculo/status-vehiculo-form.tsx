/* eslint-disable react-hooks/rules-of-hooks */
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
  IResultQueryStatusVehiculo,
  usePostStatusVehiculoMutation,
  usePutStatusVehiculoMutation,
} from "./use-status-vehiculo";
import SaveIcon from "@material-ui/icons/Save";
import { LoadingButton } from "@mui/lab";
// import {
//   IResultQueryMarca,
//   usePostMarcaMutation,
//   usePutMarcaMutation,
// } from "./use-marca";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // marginTop: theme.spacing(10),
      // marginBottom: theme.spacing(10),
      // marginLeft: theme.spacing(20),
      // marginRight: theme.spacing(20),
      padding: theme.spacing(5),
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
  statusVehiculo: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  statusVehiculo: yup.string().required("Campo requerido"),
});

interface IProps {
  statusVehiculoObj?: IResultQueryStatusVehiculo;
  id?: number;
}

export const IngresarStatusVehiculoForm: FC<IProps> = ({
  statusVehiculoObj,
  id,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [loadingMutate, setLoadingMutate] = useState<boolean>(false);

  const [boolPut, setBoolPut] = useState<boolean>(false);

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      router.push({ pathname: "/mantenimiento/status-vehiculo/listado" });
    }
    // }, 2000);
  }, [boolPut, openModalMsj, router]);

  const [mutate] = isNil(statusVehiculoObj)
    ? usePostStatusVehiculoMutation()
    : usePutStatusVehiculoMutation();

  const init = useMemo(() => {
    return isNotNilOrEmpty(statusVehiculoObj)
      ? {
          statusVehiculo: statusVehiculoObj?.statusVehiculo,
        }
      : initialValues;
  }, [statusVehiculoObj]);

  const onSubmit = useCallback(async ({ statusVehiculo }) => {
    try {
      if (isNotNilOrEmpty(statusVehiculo)) {
        setLoadingMutate(true);
        const { data } = isNil(statusVehiculoObj)
          ? await mutate({
              variables: {
                statusVehiculo,
              },
            })
          : await mutate({
              variables: {
                id,
                statusVehiculo,
              },
            });

        if (isNotNilOrEmpty(data)) {
          const { code, message } = isNotNilOrEmpty(data.PutStatusVehiculo)
            ? data.PutStatusVehiculo
            : data.PostStatusVehiculo;
            setOpenModalMsj(true);
            if (code === 200 && isNotNilOrEmpty(data.PutStatusVehiculo)) {
              setBoolPut(true);
              setErrorModal(false);
            }
          setLoadingMutate(false);
          setTitleModalMsj(message);

       
          
          resetForm();
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
      setMensajeModalMsj("El status no ha sido guardado: " + error.message);
      setOpenModalMsj(true);
    }
  }, [id, statusVehiculoObj]);

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
          Registro de los estados de los Vehiculos
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
            id="statusVehiculo"
            value={values.statusVehiculo}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Status"
            margin="normal"
            error={
              touched.statusVehiculo && isNotNilOrEmpty(errors.statusVehiculo)
            }
            helperText={
              touched.statusVehiculo ? errors.statusVehiculo : undefined
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
            variant="text"
            startIcon={<SaveIcon />}
          >
            Guardar
          </LoadingButton>
        </div>
      </form>
    </Box>
  );
};
