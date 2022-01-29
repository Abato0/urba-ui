import { useEffect, useMemo, useState, useCallback } from "react";

import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import {
  IIntegranteFilterInput,
  IIntegranteVariables,
  IListaIntegranteFilterQuery,
  IListaListadoIntegranteQuery,
  useListadoIntegranteQuery,
  useListaIntergranteFilterQuery,
} from "../../components/integrante/use-intergrante";
import AppLayout from "../../components/layout/app-layout";
import CardTable from "../../components/table/card-table";
import dataTable from "../../components/table/dataTable";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import useDebounce from "../../utils/useDebounce";
import Fuse from "fuse.js";
import XLSX from "xlsx";
import { equals, is, isEmpty, isNil, omit, pluck, prop } from "ramda";
import { headIntegranteTable } from "../../components/integrante/integrante-dataTable";
import {
  colors,
  Divider,
  makeStyles,
  createStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { useListarGrupoFamiliar } from "../../components/grupo-familiar/use-grupo-familia";
import { useRouter } from "next/router";
import {
  calleInterseccion,
  CallesPrincipales,
  manzanas,
} from "../../components/core/input/dateSelect";
import FormControlHeader from "../../components/core/input/form-control-select";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
    },
    contentButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(1),
      color: "white",
      margin: theme.spacing(1),
      height: "50%",
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
      },
      width: theme.spacing(2),
    },
    textBox: {
      backgroundColor: "",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      // paddingTop: theme.spacing(6),
      // paddingBottom: theme.spacing(6),
    },
    selectFilter: {
      // padding: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 220,
      // textAlign: "center"
    },
    image: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: theme.spacing(3),
    },
    contenFilter: {
      backgroundColor: colors.grey[50],
      marginBottom: theme.spacing(5),
      marginTop: theme.spacing(2),
      // display: "flex",
      // alignItems: "center",
      // justifyContent: "center",
    },
    contentForm: {
      marginTop: theme.spacing(3),
    },
    // table: {
    //   backgroundColor: colors.grey[700],
    // },
  })
);

const extractData = (
  data: IListaIntegranteFilterQuery
): IIntegranteVariablesNormalize[] => {
  return isNotNilOrEmpty(data)
    ? VariablesNormalizeIntegrantes(data.ListaIntegranteFilter)
    : [];
};

const VariablesNormalizeIntegrantes = (data: IIntegranteVariables[]) => {
  return isNotNilOrEmpty(data)
    ? data.map(({ grupoFamiliar, ...input }) => {
        return omit(["__typename"], {
          ...input,
          nombre_familiar: grupoFamiliar.nombre_familiar,
          manzana: grupoFamiliar.manzana,
          calle_principal: grupoFamiliar.calle_principal,
          calle_interseccion: grupoFamiliar.calle_interseccion,
          villa: grupoFamiliar.villa,
        });
      })
    : [];
};

export interface IIntegranteVariablesNormalize {
  id: number;
  tipo_doc_identidad: string;
  num_doc_identidad: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  genero: string;
  fecha_nacimiento: string;
  piso_ocupa: string;
  status: string;

  nombre_familiar: string;
  calle_principal: string;
  calle_interseccion: string;
  manzana: string;
  villa: string;
}

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["cedula", "nombre", "apellido"],
};
const getRowId = prop("id");

const ListadoIntegrante = () => {
  const classes = useStyles();
  const router = useRouter();

  const [dataTable, setDataTable] = useState<IIntegranteVariablesNormalize[]>(
    []
  );
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search, 300);
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [inputFilter, setInputFilter] = useState<IIntegranteFilterInput>({});

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const { data, loading, error } = useListaIntergranteFilterQuery(inputFilter);

  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
    number | undefined
  >();
  const [callePrincipalFilter, setCallePrincipalFilter] = useState<string>("");
  const [cllInterseccionFilter, setClleInterseccionFilter] =
    useState<string>("");
  const [manzanaFilter, setManzanaFilter] = useState<string>("");

  useEffect(() => {
    if (!loading && !isNil(data) && isNil(error)) {
      setDataTable(extractData(data!));
      // console.log("extractData: ", extractData(data!));
      // console.log("datas: ", data);
    }
  }, [loading, data]);

  const fuse = useMemo(() => {
    if (isNotNilOrEmpty(data)) {
      const myIndex = Fuse.createIndex(optionsFuse.keys!, extractData(data!));
      return new Fuse(extractData(data!), optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataTable(result);
    } else {
      setDataTable(extractData(data!));
    }
  }, [debounceSearch]);

  const onEdit = ({ id }: any) => {
    if (!isNil(id)) {
      router.push(
        { pathname: "/integrante/ingresar/[id]" },
        `/integrante/ingresar/${encodeURIComponent(id)}`
      );
    }
  };

  const onDelete = async ({ id }: any) => {};

  const ExportExcel = useCallback(() => {
    if (isNotNilOrEmpty(dataTable)) {
      const workSheet = XLSX.utils.json_to_sheet(dataTable);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Integrantes");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(
        workBook,
        "Listado de Integrantes por Grupo Familiares.xlsx"
      );
    }
  }, [dataTable]);

  const filtrar = useCallback(() => {
    setInputFilter({
      idGrupoFamiliar:
        equals(idGrupoFamiliarFilter, 0) || isNil(idGrupoFamiliarFilter)
          ? undefined
          : idGrupoFamiliarFilter,
      calle_interseccion: isEmpty(cllInterseccionFilter)
        ? undefined
        : cllInterseccionFilter,

      calle_principal: isEmpty(callePrincipalFilter)
        ? undefined
        : callePrincipalFilter,
      manzana: isEmpty(manzanaFilter) ? undefined : manzanaFilter,
    });
  }, [
    idGrupoFamiliarFilter,
    cllInterseccionFilter,
    callePrincipalFilter,
    callePrincipalFilter,
    manzanaFilter,
  ]);

  const reset = useCallback(() => {
    setIdGrupoFamiliarFilter(undefined);
    setCallePrincipalFilter("");
    setClleInterseccionFilter("");
    setManzanaFilter("");
    setInputFilter({});
  }, []);

  return (
    <AppLayout>
      {!loading && (
        <>
          {openModalMsj && (
            <ModalAuth
              openModal={openModalMsj}
              setOpenModal={setOpenModalMsj}
              title={titleModalMsj}
              message={mensajeModalMsj}
            />
          )}

          <CardTable
            columns={headIntegranteTable}
            dataTable={dataTable}
            ExportExcel={ExportExcel}
            // data={data}

            getRowId={getRowId}
            onEdit={onEdit}
            onDelete={onDelete}
            idTable={"integrantesTable"}
            titlePdf={"Listado de Integrantes por Familias"}
            columnsPdf={[
              "Cedula",
              "Nombre",
              "Apellido",
              "Fecha de Nacimiento",
              "Familia",
              "Parentesco",
              "Manzana",
              "Villa",
              "Calle",
            ]}
            search={search}
            setSearch={setSearch}
            lengthData={extractData(data!).length}
          >
            <Divider />

            <div className={classes.contenFilter}>
              <div className={classes.contentButtons}>
                <div className={classes.contentForm}>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="idGrupoFamiliar_label">
                      Grupo Familiar
                    </InputLabel>
                    <Select
                      className={classes.selectFilter}
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
                              <MenuItem value={id}>{nombre_familiar}</MenuItem>
                            );
                          }
                        )}
                    </Select>
                  </FormControl>

                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="callerPrincipal_label">
                      Calle Principal
                    </InputLabel>
                    <Select
                      className={classes.selectFilter}
                      labelId="callerPrincipal_label"
                      value={callePrincipalFilter}
                      onChange={(e) =>
                        setCallePrincipalFilter(e.target.value as string)
                      }
                    >
                      <MenuItem value={""}> - Deseleccionar - </MenuItem>
                      {CallesPrincipales.map((calle) => {
                        return (
                          <MenuItem
                            key={"integranteListado" + calle}
                            value={calle}
                          >
                            {calle}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="callerInterseccion_label">
                      Calle Interseccion
                    </InputLabel>
                    <Select
                      className={classes.selectFilter}
                      labelId="callerInterseccion_label"
                      value={cllInterseccionFilter}
                      onChange={(e) =>
                        setClleInterseccionFilter(e.target.value as string)
                      }
                    >
                      <MenuItem value={""}> - Deseleccionar - </MenuItem>
                      {calleInterseccion.map((calle) => {
                        return (
                          <MenuItem
                            key={"integranteListado" + calle}
                            value={calle}
                          >
                            {calle}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="manzana_label">Manzana</InputLabel>
                    <Select
                      className={classes.selectFilter}
                      labelId="manzana_label"
                      value={manzanaFilter}
                      onChange={(e) =>
                        setManzanaFilter(e.target.value as string)
                      }
                    >
                      <MenuItem value={""}> - Deseleccionar - </MenuItem>
                      {manzanas.map((manzana) => {
                        return (
                          <MenuItem
                            key={"integranteListado" + manzana}
                            value={manzana}
                          >
                            {manzana}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div></div>

                <div></div>

                <div>
                  <Button className={classes.button} onClick={filtrar}>
                    Filtrar
                  </Button>
                  <Button className={classes.button} onClick={reset}>
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            <Divider />
          </CardTable>
        </>
      )}
    </AppLayout>
  );
};

export default ListadoIntegrante;
