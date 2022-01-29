import React from "react";
import AppLayout from "../../components/layout/app-layout";
import {
  IDataListaPagoFilter,
  IPagoGrupoFamiliarInput,
  usePagoFamiliar,
  usePagoFamiliarFilters,
} from "../../components/pago/use-pago";
import {
  concat,
  equals,
  head,
  isEmpty,
  isNil,
  last,
  omit,
  pluck,
  prop,
  split,
  tail,
} from "ramda";
import {
  AllPagoTable,
  headPagoTable,
} from "../../components/pago/pago-dataTable";
import TablePaginations from "../../components/table/table-paginations";
import {
  Button,
  ButtonGroup,
  colors,
  createStyles,
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableContainer,
  TableFooter,
  TableRow,
  TextField,
} from "@material-ui/core";
import { ExportTablePdf } from "../../components/table/export-table-pdf";
import { usePagination, useTable } from "react-table";
import TableHeader from "../../components/table/table-header";
import CardTableBody from "../../components/table/table-body";
import useDebounce from "../../utils/useDebounce";
import Fuse from "fuse.js";
import { TableCell } from "@material-ui/core";
import { isNotNilOrEmpty } from "../../utils/is-nil-empty";
import { useQuery } from "@apollo/client";
import { listadoGrupoFamiliar } from "../../components/grupo-familiar/grupo-familiar-typeDefs";
import ModalImagen from "../../components/core/input/dialog/modal-ver-imagen";
import {
  useArrIntervaloFechaAporte,
  useListarAporteQuery,
} from "../../components/aporte/use-aporte";
import XLSX from "xlsx";
import { useListarGrupoFamiliar } from "../../components/grupo-familiar/use-grupo-familia";
import { grey } from "@material-ui/core/colors";
import { rangoFechaAportePagoService } from "../../utils/parseDate";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
      // width: 80
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

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["nombre_familiar"],
};

interface IDataTablePagoListado {
  id: number;
  nombre_familiar: string;
  fecha_pago: string;
  descripcion: string;
  estado: string;
  monto: number;
  nombre_aporte: string;
  tipo_aporte: string;
}

const extractData = (data: IDataListaPagoFilter[]) => {
  console.log("data de la funcion extracData: ", data);
  return data.map(({ id, pago, aporte, grupoFamiliar }, index) => {
    return {
      ...pago,
      ...aporte,
      id,
      nombre_familiar: grupoFamiliar.nombre_familiar,

      // nombre_aporte: aporte.nombre_aporte,
      // tipo_aporte: aporte.tipo_aporte,
    };
  });

  // const allPagoBodyTable: AllPagoTable[] = [];
  // data.forEach(({ id, pago, grupoFamiliar }) => {
  //   allPagoBodyTable.push({
  //     ...pago,
  //     id,
  //     nombre_familiar: grupoFamiliar.nombre_familiar,
  //   });
  // });
  // return allPagoBodyTable;
};

export const calcularMonto = (data: AllPagoTable[]) => {
  let acum = 0;
  if (isNotNilOrEmpty(data)) {
    data.forEach(({ monto }) => {
      acum += monto;
    });
  }
  return acum;
};

const ListadoPago = () => {
  const classes = useStyles();
  // const { data, loading, error } = useAllListadoPago();
  const [allPagoData, setAllPagoData] = React.useState<IDataTablePagoListado[]>(
    []
  );
  const [search, setSearch] = React.useState<string>("");
  const [idPago, setIdPago] = React.useState<number>(0);
  const [base64, setBase64] = React.useState<string>("");

  const [tipoAporteFilter, setTipoAporteFilter] = React.useState<
    number | undefined
  >();
  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = React.useState<
    number | undefined
  >();

  const [fechaAporteFilter, setFechaAporteFilter] = React.useState<string>("");
  const [filterInput, setFilterInput] = React.useState<IPagoGrupoFamiliarInput>(
    {}
  );

  const { data, loading, error } = usePagoFamiliarFilters(filterInput);

  const {
    data: dataAporte,
    loading: loadingAporte,
    error: erroAporte,
  } = useListarAporteQuery();

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const debounceSearch = useDebounce(search, 300);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  const {
    data: dataPagoFamiliar,
    loading: loadingPagoFamiliar,
    error: errorPagoFamiliar,
  } = usePagoFamiliar(idPago);

  const idTable = React.useMemo(() => {
    return "listadoPagoTable";
  }, []);

  const titlePdf = React.useMemo(() => {
    return "Listado Pago";
  }, []);

  const columnsPdf = React.useMemo(() => {
    return [
      "Nombre Familiar",
      "Nombre del Aporte",
      "Tipo del Aporte",
      "Fecha del Pago",
      "Descripcion",
      "Monto",
    ];
  }, []);

  const onSeeImg = ({ id }: any) => {
    // console.log({ id });
    if (id) {
      setIdPago(id);
      setOpen(true);
    }
  };

  const fuse = React.useMemo(() => {
    if (!isEmpty(data) && !isNil(data)) {
      const myIndex = Fuse.createIndex(
        optionsFuse.keys!,
        // extractData(data.ListaPagos)
        extractData(data.ListaPagoFamiliarFilter)
      );
      // return new Fuse(extractData(data.ListaPagos), optionsFuse, myIndex);
      return new Fuse(
        extractData(data.ListaPagoFamiliarFilter),
        optionsFuse,
        myIndex
      );
    }
  }, [data]);

  React.useEffect(() => {
    if (!loading && !isNil(data)) {
      // setAllPagoData(extractData(data.ListaPagos));
      setAllPagoData(extractData(data.ListaPagoFamiliarFilter));

      console.log(
        "data extractData: ",
        extractData(data.ListaPagoFamiliarFilter)
      );

      //   console.log("data: ", extractData(data.ListaPagos));
    }
    // console.log("data: ", data);
  }, [loading, data]);

  React.useEffect(() => {
    if (!isEmpty(debounceSearch) && !isNil(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setAllPagoData(result);
    } else {
      // if (data) setAllPagoData(extractData(data.ListaPagos));}
      if (data) setAllPagoData(extractData(data.ListaPagoFamiliarFilter));
    }
  }, [debounceSearch]);

  React.useEffect(() => {
    if (!loading && isNotNilOrEmpty(dataPagoFamiliar)) {
      // console.log("dataPagoFamiliar: ", dataPagoFamiliar);
      const { pago } = dataPagoFamiliar!.GetPagoFamiliar;
      setBase64(pago.imagen_recibo!);
    }
  }, [dataPagoFamiliar, loadingPagoFamiliar]);

  // const getRowId = React.useMemo(() => {
  //   return isNotNilOrEmpty(tipoAporteFilter) &&
  //     isNotNilOrEmpty(fechaAporteFilter)
  //     ? prop("nombre_familiar")
  //     : prop("id");
  // }, [tipoAporteFilter, fechaAporteFilter]);

  const getRowId = prop("id");
  const {
    getTableProps,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    page,
    prepareRow,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: headPagoTable,
      data: allPagoData,
      getRowId,
      onSeeImg,
    },
    usePagination
  );

  const onChangePage = React.useCallback(
    (event, page) => gotoPage(page),
    [gotoPage]
  );

  const onChangeRowsPerPage = React.useCallback(
    (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
    [setPageSize]
  );

  const filtrar = () => {
    setFilterInput({
      fecha_pago: isEmpty(fechaAporteFilter) ? undefined : fechaAporteFilter,
      idGrupoFamiliar:
        equals(idGrupoFamiliarFilter, 0) || isNil(idGrupoFamiliarFilter)
          ? undefined
          : idGrupoFamiliarFilter,
      id_aporte: isNil(tipoAporteFilter) ? undefined : Number(tipoAporteFilter),
    });
  };
  const cancelFiltrar = () => {
    setIdGrupoFamiliarFilter(0);
    setTipoAporteFilter(0);
    setFechaAporteFilter("");
    setFilterInput({});
  };

  const ExportExcel = () => {
    if (isNotNilOrEmpty(allPagoData)) {
      const workSheet = XLSX.utils.json_to_sheet(allPagoData);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Pagos");
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "Listado de Pagos Generados.xlsx");
    }
  };

  return (
    <AppLayout>
      <Paper className={classes.root}>
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
              idTable={idTable}
              title={titlePdf}
              columns={columnsPdf}
            />
            <Button
              className={classes.button}
              // color="secondary"
              onClick={ExportExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>
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

              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="tipo_aporter_label">Aporte</InputLabel>
                <Select
                  labelId="tipo_aporter_label"
                  value={tipoAporteFilter}
                  onChange={(e) =>
                    setTipoAporteFilter(e.target.value as number)
                  }
                >
                  <MenuItem value="">- Deseleccionar -</MenuItem>
                  {!loadingAporte &&
                    isNotNilOrEmpty(dataAporte) &&
                    dataAporte?.ListaAportes.map(
                      ({ id, nombre_aporte, tipo_aporte }) => {
                        return (
                          <MenuItem key={"listadoPago-" + id} value={id}>
                            {`${nombre_aporte} - ${tipo_aporte}`}
                          </MenuItem>
                        );
                      }
                    )}
                </Select>
              </FormControl>

              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="fecha_aporte_label">Fecha</InputLabel>
                <Select
                  labelId="fecha_aporte_label"
                  value={tipoAporteFilter}
                  onChange={(e) =>
                    setFechaAporteFilter(e.target.value as string)
                  }
                >
                  <MenuItem value="">- Deseleccionar -</MenuItem>
                  {!loadingAporte &&
                    isNotNilOrEmpty(dataAporte) &&
                    isNotNilOrEmpty(tipoAporteFilter) &&
                    tipoAporteFilter !== 0 &&
                    rangoFechaAportePagoService(
                      dataAporte?.ListaAportes.find(
                        ({ id }) => id === tipoAporteFilter
                      )!
                    ).map((date) => {
                      return (
                        <MenuItem key={"listadoPagoFecha-" + date} value={date}>
                          {date}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            <div>
              <Button className={classes.button} onClick={filtrar}>
                Filtrar
              </Button>
              <Button className={classes.button} onClick={cancelFiltrar}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
        <Divider />

        <TableContainer>
          <Table
            stickyHeader
            aria-label="sticky table"
            {...getTableProps()}
            id={idTable}
            // className={classes.table}
          >
            <TableHeader headerGroups={headerGroups} />
            <CardTableBody
              getTableBodyProps={getTableBodyProps}
              page={page}
              prepareRow={prepareRow}
            />
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{calcularMonto(allPagoData)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        <TablePaginations
          lengthData={allPagoData.length}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Paper>
      <ModalImagen
        open={open}
        handleClose={handleClose}
        base64={base64}
        classes={classes}
      />
    </AppLayout>
  );
};

export default ListadoPago;
