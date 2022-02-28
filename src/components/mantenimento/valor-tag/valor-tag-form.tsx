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
import { Paper } from "@material-ui/core";
import {
  IResultQueryValorTag,
  useListadoValorTag,
  usePostValorTag,
  usePutValorTag,
} from "./use-valor-tag";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../../utils/is-nil-empty";
import ModalAuth from "../../core/input/dialog/modal-dialog";

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
      flexDirection: "column",
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
    containerPaper: {
      display: "flex",
      width: "100%",
      justifyContent: "center",
      marginBottom: theme.spacing(3),
    },
    paperValorTag: {
      backgroundColor: colors.purple[50],
      padding: theme.spacing(2),
    },
    labelValorTag: {
      fontWeight: "bold",
    },
  })
);

const initialValues = Object.freeze({
  tipo_tag: "",
  valor: undefined,
});

const validationSchema = yup.object().shape({
  //   id_aporte: yup.number().required(),
  tipo_tag: yup.string().required("Campo requerido"),
  valor: yup.number().required("Campo requerido"),
});

interface IProps {
  valorTagObj?: IResultQueryValorTag;
  id?: number;
}

export const IngresarValorTagForm: FC<IProps> = ({ id, valorTagObj }) => {
  const classes = useStyles();
  const router = useRouter();
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [boolPut, setBoolPut] = useState<boolean>(false);

  const { refetch } = useListadoValorTag();

  const init = useMemo(() => {
    return isNotNilOrEmpty(valorTagObj)
      ? {
          tipo_tag: valorTagObj?.tipo_tag,
          valor: valorTagObj?.valor,
        }
      : initialValues;
  }, [valorTagObj]);

  useEffect(() => {
    // setTimeout(() => {
    if (!openModalMsj && boolPut) {
      refetch().then(() => {
        router.push({ pathname: "/mantenimiento/valor-tag/listado" });
      });
    }
    // }, 2000);
  }, [boolPut, openModalMsj]);

  // const { data, loading, error } = useGetValorTagQuery();

  const [mutate] = isNilOrEmpty(valorTagObj)
    ? usePostValorTag()
    : usePutValorTag();

  const onSubmit = useCallback(async ({ tipo_tag, valor }) => {
    try {
      if (isNotNilOrEmpty(valor) && isNotNilOrEmpty(tipo_tag)) {
        const { data } = isNilOrEmpty(valorTagObj)
          ? await mutate({
              variables: {
                tipo_tag,
                valor,
              },
            })
          : await mutate({
              variables: {
                id: Number(id),
                tipo_tag,
                valor,
              },
            });

        if (isNotNilOrEmpty(data)) {
          const { code, message } = isNilOrEmpty(valorTagObj)
            ? data.PostValorTag
            : data.PutValorTag;
          setTitleModalMsj(message);
          setErrorModal(code === 200 ? false : true);
          setOpenModalMsj(true);
          if (isNotNilOrEmpty(data.PutValorTag) && code === 200) {
            setBoolPut(true);
          }
          // resetForm();
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
      setMensajeModalMsj("La marca no ha sido guardado: " + error.message);
      setOpenModalMsj(true);
    }
  }, []);

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
        <Typography variant="overline">Registro del valor del Tag</Typography>
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
            id="tipo_tag"
            value={values.tipo_tag}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Tipo de Tag"
            margin="normal"
            error={touched.tipo_tag && isNotNilOrEmpty(errors.tipo_tag)}
            helperText={touched.tipo_tag ? errors.tipo_tag : undefined}
            required
          />
        </div>
        <div className={classes.contentLastTextBox}>
          <TextField
            className={classes.textbox}
            variant="outlined"
            id="valor"
            type={"number"}
            value={values.valor}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Valor del Tag"
            margin="normal"
            error={touched.valor && isNotNilOrEmpty(errors.valor)}
            helperText={touched.valor ? errors.valor : undefined}
            required
          />
        </div>
        <div className={classes.contentButtons}>
          <div></div>
          <Button startIcon={<SaveIcon />} type="submit" variant="outlined">
            {" "}
            Guardar
          </Button>
        </div>
      </form>
    </Box>
  );
};
