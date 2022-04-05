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
  IResultQueryParentesco,
  usePostParentescoMutation,
  usePutParentescoMutation,
} from "./use-parentesco";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@material-ui/icons/Save";
import { useListadoUsuario } from "../../usuarios/use-usuario";

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
  parentesco: "",
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  parentesco: yup.string().required("Campo requerido"),
});

interface IProps {
  parentescoObj?: IResultQueryParentesco;
  id?: number;
}

export const IngresarParentescoForm: FC<IProps> = ({ parentescoObj, id }) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [boolPut, setBoolPut] = useState<boolean>(false);
  const [loadingMutate, setLoadingMutate] = useState<boolean>(false);



  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      router.push({ pathname: "/mantenimiento/parentesco/listado" });
    }
    // }, 2000);
  }, [boolPut, openModalMsj, router]);

  const [mutate] = isNil(parentescoObj)
    ? usePostParentescoMutation()
    : usePutParentescoMutation();

  const init = useMemo(() => {
    return isNotNilOrEmpty(parentescoObj)
      ? {
          parentesco: parentescoObj?.parentesco,
        }
      : initialValues;
  }, [parentescoObj]);

  const onSubmit = useCallback(
    async ({ parentesco }) => {
      try {
        if (isNotNilOrEmpty(parentesco)) {
          setLoadingMutate(true);
          const { data } = isNil(parentescoObj)
            ? await mutate({
                variables: {
                  parentesco,
                },
              })
            : await mutate({
                variables: {
                  id,
                  parentesco,
                },
              });

          if (isNotNilOrEmpty(data)) {
            const { code, message } = isNotNilOrEmpty(data.PostParentesco)
              ? data.PostParentesco
              : data.PutParentesco;
            setLoadingMutate(false);
            setTitleModalMsj(message);

            if (isNotNilOrEmpty(data.PutParentesco)) {
              setBoolPut(true);
            }
            if (code === 200) {
              setErrorModal(false);
            }
            setOpenModalMsj(true);
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
        setMensajeModalMsj(
          "El parentesco no ha sido guardado: " + error.message
        );
        setOpenModalMsj(true);
      }
    },
    [id, parentescoObj]
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
        <Typography variant="overline">
          {parentescoObj
            ? `Actualización de parentesco : ${parentescoObj.parentesco}`
            : "Registro de Parentesco"}
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
            id="parentesco"
            value={values.parentesco}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Parentesco"
            margin="normal"
            error={touched.parentesco && isNotNilOrEmpty(errors.parentesco)}
            helperText={touched.parentesco ? errors.parentesco : undefined}
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
