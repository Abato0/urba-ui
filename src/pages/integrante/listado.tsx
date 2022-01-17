import { useEffect, useMemo, useState, useCallback } from "react";

import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import {
  IIntegranteVariables,
  IListaListadoIntegranteQuery,
  useListadoIntegranteQuery,
} from "../../components/integrante/use-intergrante";
import AppLayout from "../../components/layout/app-layout";
import CardTable from "../../components/table/card-table";
import dataTable from "../../components/table/dataTable";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import useDebounce from "../../utils/useDebounce";
import Fuse from "fuse.js";
import XLSX from "xlsx";
import { is, isNil, omit, pluck, prop } from "ramda";
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
    },
    // table: {
    //   backgroundColor: colors.grey[700],
    // },
  })
);

const extractData = (
  data: IListaListadoIntegranteQuery
): IIntegranteVariablesNormalize[] => {
  return isNotNilOrEmpty(data)
    ? VariablesNormalizeIntegrantes(data.ListaIntegrantes)
    : [];
};

const VariablesNormalizeIntegrantes = (data: IIntegranteVariables[]) => {
  return isNotNilOrEmpty(data)
    ? data.map(({ grupoFamiliar, ...input }) => {
        return omit(["__typename"], {
          ...input,
          nombre_familiar: grupoFamiliar.nombre_familiar,
          manzana: grupoFamiliar.manzana,
          calle: grupoFamiliar.calle,
          villa: grupoFamiliar.villa,
        });
      })
    : [];
};

export interface IIntegranteVariablesNormalize {
  id: number;
  apellido: string;
  cedula: string;
  fecha_nacimiento: string;
  nombre: string;
  parentesco: string;
  telefono: string;
  nombre_familiar: string;
  manzana: string;
  villa: string;
  calle: string;
}

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["cedula", "nombre", "apellido"],
};
const getRowId = prop("id");

const ListadoIntegrante = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useListadoIntegranteQuery();

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const [dataTable, setDataTable] = useState<IIntegranteVariablesNormalize[]>(
    []
  );
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search, 300);
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");

  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (!loading && isNilOrEmpty(error)) setDataTable(extractData(data!));
  }, [loading, error]);

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

  const onDelete = async ({ id }: any) => {
    // try {
    //   await mutate({ variables: { id: Number(id) } });
    //   setTitleModalMsj("Grupo Familiar Eliminado");
    //   setMensajeModalMsj(
    //     "El Grupo Familiar seleccionado se ha eliminado correctamente"
    //   );
    //   setOpenModalMsj(true);
    //   setDataTable(extractData(data));
    // } catch (error) {
    //   setTitleModalMsj("Grupo Familiar no Eliminado");
    //   setMensajeModalMsj(
    //     "Ha ocurrido un error. El Grupo Familiar seleccionado no se ha eliminado"
    //   );
    //   setOpenModalMsj(true);
    // }
    // console.log("data onDelete:", data, error);
  };

  const ExportExcel = () => {
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
  };

  const filtrar = useCallback(() => {
    if (isNotNilOrEmpty(data) && isNotNilOrEmpty(idGrupoFamiliarFilter)) {
      // const result = data?.ListaIntegrantes.map((integrante) => {
      //   if (integrante.grupoFamiliar.id === idGrupoFamiliarFilter)
      //     return integrante;
      // });

      const result = data?.ListaIntegrantes.filter(
        ({ grupoFamiliar }) => grupoFamiliar.id === idGrupoFamiliarFilter
      );
      setDataTable(VariablesNormalizeIntegrantes(result!));
      // console.log("result: ", result);
    }
  }, [idGrupoFamiliarFilter]);

  const reset = useCallback(() => {
    setDataTable(extractData(data!));
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
                <div>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="idGrupoFamiliar_label">
                      Grupo Familiar
                    </InputLabel>
                    <Select
                      className={classes.selectFilter}
                      // variant="outlined"
                      labelId="idGrupoFamiliar_label"
                      // label={<p>Grupo Familiar</p>}
                      id="idGrupoFamiliar"
                      name="idGrupoFamiliar"
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
                </div>

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
