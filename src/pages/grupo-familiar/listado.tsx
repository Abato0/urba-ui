import React, { useCallback, useEffect, useState } from "react";
import {
  useListarGrupoFamiliar,
  useDeleteGrupoFamiliarMutatio,
  useListarGrupoFamiliarFilterQuery,
  IListaGruposFamiliaresFilter,
} from "../../components/grupo-familiar/use-grupo-familia";
import AppLayout from "../../components/layout/app-layout";
//import { head, rows } from "../../components/core/input/data";
// import DataTable from "../../components/table/dataTable";
import { head } from "../../components/grupo-familiar/grupo-familiar-dataTable";
// import { Fade, LinearProgress } from "@material-ui/core";
import { isNil, isEmpty, prop, pluck, omit, map, equals } from "ramda";

import { IGrupoFamiliar } from "../../interface/grupo-familiar.interface";
import Fuse from "fuse.js";
import { listadoGrupoFamiliar } from "../../components/grupo-familiar/grupo-familiar-typeDefs";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import useDebounce from "../../utils/useDebounce";
import CardTable from "../../components/table/card-table";
import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import XLSX from "xlsx";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";
import { IIntegranteFilterInput } from "../../components/integrante/use-intergrante";
import {
  colors,
  Divider,
  makeStyles,
  MenuItem,
  createStyles,
  FormControl,
  InputLabel,
  Select,
  Button,
} from "@material-ui/core";
import {
  calleInterseccion,
  CallesPrincipales,
  manzanas,
} from "../../components/core/input/dateSelect";

const getRowId = prop("nombre_familiar");

const optionsFuse: Fuse.IFuseOptions<IGrupoFamiliar> = {
  keys: ["nombre_familiar"],
};

const extractData = (data: IListaGruposFamiliaresFilter) => {
  return !isNil(data) && !isEmpty(data) ? data.ListaGruposFamiliaresFilter : [];
};

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
      margin:"30px"
    },
    contentButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      // alignContent: "center",
      alignItems: "center",
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
      minWidth:100,
      maxHeight:40
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

const ListadoUsuario = () => {
  const classes = useStyles();

  const [dataTable, setDataTable] = React.useState<IGrupoFamiliar[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const router = useRouter();
  const debounceSearch = useDebounce(search, 300);
  const [mutate] = useDeleteGrupoFamiliarMutatio(0);

  const [inputFilter, setInputFilter] = useState<IIntegranteFilterInput>({});
  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
    number | undefined
  >();
  const [callePrincipalFilter, setCallePrincipalFilter] = useState<string>("");
  const [cllInterseccionFilter, setClleInterseccionFilter] =
    useState<string>("");
  const [manzanaFilter, setManzanaFilter] = useState<string>("");

  const { data, loading, error } =
    useListarGrupoFamiliarFilterQuery(inputFilter);

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const fuse = React.useMemo(() => {
    if (!isEmpty(data) && !isNil(data)) {
      const myIndex = Fuse.createIndex(optionsFuse.keys!, extractData(data));
      return new Fuse(extractData(data!), optionsFuse, myIndex);
    }
  }, [data]);

  React.useEffect(() => {
    if (!isEmpty(debounceSearch) && !isNil(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataTable(result);
    } else {
      setDataTable(extractData(data!));
    }
  }, [debounceSearch]);

  React.useEffect(() => {
    if (!loading && !isNil(data) && isNil(error)) {
      setDataTable(extractData(data!));
      // console.log("extractData: ", extractData(data!));
      // console.log("datas: ", data);
    }
  }, [loading, data, error]);

  const onEdit = ({ id }: any) => {
    // Navigate to corresponding filing wizard page to resume filing draft
    if (!isNil(id)) {
      router.push(
        { pathname: "/grupo-familiar/registrar/[id]" },
        `/grupo-familiar/registrar/${encodeURIComponent(id)}`
      );
    }
  };

  const onDelete = async ({ id }: any) => {
    try {
      await mutate({ variables: { id: Number(id) } });
      setTitleModalMsj("Grupo Familiar Eliminado");
      setMensajeModalMsj(
        "El Grupo Familiar seleccionado se ha eliminado correctamente"
      );
      setOpenModalMsj(true);
      setDataTable(extractData(data!));
    } catch (error) {
      setTitleModalMsj("Grupo Familiar no Eliminado");
      setMensajeModalMsj(
        "Ha ocurrido un error. El Grupo Familiar seleccionado no se ha eliminado"
      );
      setOpenModalMsj(true);
    }

    // console.log("data onDelete:", data, error);
  };

  const ExportExcel = () => {
    if (isNotNilOrEmpty(dataTable)) {
      const workSheet = XLSX.utils.json_to_sheet(dataTable);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Grupos Familiares");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "GruposFamiliaresData.xlsx");
    }
  };

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
            columns={head}
            dataTable={dataTable}
            ExportExcel={ExportExcel}
            // data={data}

            getRowId={getRowId}
            onEdit={onEdit}
            onDelete={onDelete}
            idTable={"listadoGrupoFamiliarTable"}
            titlePdf={"Listado Grupo Familiar"}
            columnsPdf={[
              "Nombre Familiar",
              "Tipo de edificacion",
              "Color",
              "Calle Principal",
              "Calle Interseccion",
              "Manzana",
              "Villa",
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

export default ListadoUsuario;
