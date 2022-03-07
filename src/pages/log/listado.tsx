import {
  Button,
  colors,
  createStyles,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { isNil, pluck, prop } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";
import Fuse from "fuse.js";
import { useRouter } from "next/router";
import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import AppLayout from "../../components/layout/app-layout";
import {
  IResultQueryLog,
  useListadoLogQuery,
} from "../../components/log/use-log";
import { columnsCalle } from "../../components/mantenimento/calle/calle-dataTable";
import CardTableBody from "../../components/table/table-body";
import TableHeader from "../../components/table/table-header";
import TablePaginations from "../../components/table/table-paginations";
import { isNotNilOrEmpty, isNilOrEmpty } from "../../utils/is-nil-empty";
import useDebounce from "../../utils/useDebounce";
import { columnsLog } from "../../components/log/log-dataTable";
import {
  faEraser,
  faFileExcel,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExportTablePdf } from "../../components/table/export-table-pdf";
import XLSX from "xlsx";
import { SelectModulos } from "../../components/core/input/select/select-modulos";
import { SelectChangeEvent } from "@mui/material";
import { useListarGrupoFamiliar } from "../../components/grupo-familiar/use-grupo-familia";
import { SelectTipoUsuario } from "../../components/core/input/select/select-tipo-usuario";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
      width: "70%",
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
      // height: "50%",
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
      },
      minWidth: theme.spacing(14),
      // height: theme.spacing(12),
      padding: theme.spacing(3),
      maxHeight: theme.spacing(1),
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
    containerTitle: {
      // backgroundColor: "red",
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    title: {
      fontSize: theme.typography.pxToRem(19),
      backgroundColor: colors.grey[200],
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 5,
      // fontWeight: "bold",
      // font
    },
    labelButton: {
      fontSize: theme.typography.pxToRem(11),
      fontFamily: "Roboto",
    },
  })
);

const extractData = (data: IResultQueryLog[]) => {
  return isNotNilOrEmpty(data) ? data : [];
};

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["modulo", "accion"],
};

const getRowId = prop("id");

const LogListado = () => {
  const classes = useStyles();
  const { data, loading, error } = useListadoLogQuery();
  const [dataLog, setLogData] = useState<IResultQueryLog[]>([]);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search, 300);
  const [moduloFilter, setModuloFilter] = useState<string>();
  const [nombreGrupoFamiliarFilter, setNombreGrupoFamiliarFilter] =
    useState<string>();

  const [tipoUsuarioFilter, setTipoUsuarioFilter] = useState<string>();

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  useEffect(() => {
    if (isNotNilOrEmpty(data) && !loading) {
      setLogData(extractData(data?.ListaLog!));
    }
  }, [data, loading, error]);

  const {
    getTableProps,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    page,
    prepareRow,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns: columnsLog,
      data: dataLog,
      getRowId,
    },
    usePagination
  );

  const fuse = useMemo(() => {
    if (isNotNilOrEmpty(data)) {
      const myIndex = Fuse.createIndex(
        optionsFuse.keys!,
        extractData(data?.ListaLog!)
      );
      return new Fuse(extractData(data?.ListaLog!), optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setLogData(result);
    } else {
      setLogData(extractData(data?.ListaLog!));
    }
  }, [data?.ListaLog, debounceSearch, fuse]);

  const onChangePage = useCallback((event, page) => gotoPage(page), [gotoPage]);

  const onChangeRowsPerPage = useCallback(
    (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
    [setPageSize]
  );

  const ExportExcel = () => {
    if (isNotNilOrEmpty(dataLog)) {
      const workSheet = XLSX.utils.json_to_sheet(dataLog);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Pagos");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "Listado de Pagos Generados.xlsx");
    }
  };

  const filtrar = () => {
    if (nombreGrupoFamiliarFilter || tipoUsuarioFilter || moduloFilter) {
      const result = dataLog.filter(
        ({ modulo, tipoUsuario, nombre_familiar }) =>
          modulo == moduloFilter ||
          tipoUsuario == tipoUsuarioFilter ||
          nombre_familiar == nombreGrupoFamiliarFilter
      );

      setLogData(result);
      //   console.log("result: ", result);
    }
  };

  const reset = () => {
    if (data) {
      setNombreGrupoFamiliarFilter(undefined);
      setTipoUsuarioFilter(undefined);
      setModuloFilter(undefined);
      setLogData(extractData(data?.ListaLog));
    }
  };

  return (
    <AppLayout>
      <Paper className={classes.root}>
        <div className={classes.containerTitle}>
          <Typography variant="overline" className={classes.title}>
            Logs
          </Typography>
        </div>

        <div className={classes.contentButtons}>
          <TextField
            className={classes.textBox}
            variant="outlined"
            placeholder="Search"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
          <div>
            <ExportTablePdf
              classes={classes.button}
              idTable={"#ListadoAll"}
              title={"Log"}
              columns={[
                "Usuario",
                "Tipo de Usuario",
                "Modulo",
                "Acción",
                "Fecha",
              ]}
            />
            <Button
              className={classes.button}
              color="secondary"
              onClick={ExportExcel}
              style={{
                backgroundColor: colors.green[800],
              }}
              startIcon={<FontAwesomeIcon icon={faFileExcel} />}
            >
              <Typography className={classes.labelButton} variant="button">
                Exportar a Excel
              </Typography>
            </Button>
          </div>
        </div>

        <Divider />
        <div className={classes.contenFilter}>
          <div className={classes.contentButtons}>
            <div className={classes.contentForm}>
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
                    value={nombreGrupoFamiliarFilter}
                    onChange={(e) =>
                      setNombreGrupoFamiliarFilter(e.target.value as string)
                    }
                  >
                    <MenuItem value={undefined}> - Deseleccionar - </MenuItem>
                    {!loadingListadoGrupoFamiliar &&
                      isNotNilOrEmpty(dataListadoGrupoFamiliar) &&
                      dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                        ({ id, nombre_familiar }) => {
                          return (
                            <MenuItem
                              key={"GrupoFamiliarFilter Listado Log" + id}
                              value={nombre_familiar}
                            >
                              {nombre_familiar}
                            </MenuItem>
                          );
                        }
                      )}
                  </Select>
                </FormControl>
                <SelectModulos
                  handleChange={(e: SelectChangeEvent) =>
                    setModuloFilter(e.target.value)
                  }
                  value={moduloFilter}
                  label={"Módulo"}
                  id={"modulo_log"}
                />
                <SelectTipoUsuario
                  handleChange={(e: SelectChangeEvent) =>
                    setTipoUsuarioFilter(e.target.value)
                  }
                  value={tipoUsuarioFilter}
                  id={"tipoUsuarioFilter"}
                  label={"Rol"}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button
                startIcon={<FontAwesomeIcon icon={faFilter} />}
                className={classes.button}
                onClick={filtrar}
              >
                <Typography className={classes.labelButton} variant="button">
                  Filtrar
                </Typography>
              </Button>
              <Button
                startIcon={<FontAwesomeIcon icon={faEraser} />}
                className={classes.button}
                onClick={reset}
              >
                <Typography className={classes.labelButton} variant="button">
                  Reset
                </Typography>
              </Button>
            </div>
          </div>
        </div>
        <Divider />
        <TableContainer>
          <Table
            // className={classes.table}
            padding="normal"
            stickyHeader
            aria-label="sticky table"
            {...getTableProps()}
            id={"TableColor"}
          >
            <TableHeader headerGroups={headerGroups} />
            <CardTableBody
              getTableBodyProps={getTableBodyProps}
              page={page}
              prepareRow={prepareRow}
            />
          </Table>
        </TableContainer>
        <TablePaginations
          lengthData={isNilOrEmpty(dataLog) ? 0 : dataLog.length}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Paper>
    </AppLayout>
  );
};

export default LogListado;