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
import SaveIcon from "@material-ui/icons/Save";
import { useRouter } from "next/router";
import {
  IResultQueryColor,
  usePostColorMutation,
  usePutColorMutation,
} from "./use-color";
import { isNotNilOrEmpty } from "../../../utils/is-nil-empty";
import ModalAuth from "../../core/input/dialog/modal-dialog";
import { useListaColorQuery } from "./use-color";
import { LoadingButton } from "@mui/lab";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // marginTop: theme.spacing(10),
      // marginBottom: theme.spacing(10),
      // marginLeft: theme.spacing(20),
      // marginRight: theme.spacing(20),
      padding: "60px",
      // minWidth: "820px",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "white",
      margin: theme.spacing(2),
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
  color: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  color: yup.string().required("Campo requerido"),
});

interface IProps {
  colorObj?: IResultQueryColor;
  id?: number;
}

export const IngresarColorForm: FC<IProps> = ({ colorObj, id }) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [boolPutColor, setBoolPutColor] = useState<boolean>(false);
  const [loadingMutate, setLoadingMutate] = useState<boolean>(false);

  const { refetch } = useListaColorQuery();
  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPutColor) {
      refetch().then(() => {
        router.push({ pathname: "/mantenimiento/color/listado" });
      });
    }
    // }, 2000);
  }, [boolPutColor, openModalMsj, router]);

  const [mutate] = isNil(colorObj)
    ? usePostColorMutation()
    : usePutColorMutation();

  const init = useMemo(() => {
    return isNotNilOrEmpty(colorObj)
      ? {
          color: colorObj?.color,
        }
      : initialValues;
  }, [colorObj]);

  const onSubmit = useCallback(
    async ({ color }) => {
      try {
        if (isNotNilOrEmpty(color)) {
          setLoadingMutate(true);
          const { data } = isNil(colorObj)
            ? await mutate({
                variables: {
                  color,
                },
              })
            : await mutate({
                variables: {
                  id,
                  color,
                },
              });

          if (isNotNilOrEmpty(data)) {
            const { message } = isNotNilOrEmpty(data.PutColor)
              ? data.PutColor
              : data.PostColor;
            setLoadingMutate(false);
            setTitleModalMsj(message);

            //   setTimeout(() => {

            //   }, 2000);

            setErrorModal(false);
            // setMensajeModalMsj(dataMutate.message);
            setOpenModalMsj(true);
            if (isNotNilOrEmpty(data.PutColor)) {
              setBoolPutColor(true);
            } else if (isNotNilOrEmpty(data.PostColor)) {
              await refetch();
            }
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
        setTitleModalMsj("Envio Fallido");
        setErrorModal(true);
        setMensajeModalMsj("Integrante no ha sido guardado: " + error.message);
        setOpenModalMsj(true);
      }
    },
    [colorObj, id]
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
        <Typography variant="overline">Registro de Colores</Typography>
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
            id="color"
            value={values.color}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Color"
            margin="normal"
            error={touched.color && isNotNilOrEmpty(errors.color)}
            helperText={touched.color ? errors.color : undefined}
            required
          />
        </div>
        <div className={classes.contentButtons}>
          <div></div>
          <LoadingButton
            loading={loadingMutate}
            loadingPosition="start"
            type="submit"
            variant="outlined"
            startIcon={<SaveIcon />}
          >
            Guardar
          </LoadingButton>
        </div>
      </form>
    </Box>
  );
};
