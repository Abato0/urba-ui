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
import { IResultQueryTags, useListaTags } from "../../components/tag/use-tag";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../utils/is-nil-empty";
import Fuse from "fuse.js";
import { columnsTags } from "../../components/tag/tag-dataTable";
import useDebounce from "../../utils/useDebounce";
import ModalAuth from "../../components/core/input/dialog/modal-dialog";
import AppLayout from "../../components/layout/app-layout";
import CardTableBody from "../../components/table/table-body";
import TableHeader from "../../components/table/table-header";
import TablePaginations from "../../components/table/table-paginations";
import { useListarGrupoFamiliar } from "../../components/grupo-familiar/use-grupo-familia";
import { padding } from "@mui/system/spacing";
import { useListadoValorTag } from "../../components/mantenimento/valor-tag/use-valor-tag";
import { faEraser, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
      width: "50%",
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
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "space-between",
    },
    contentForm: {
      marginTop: theme.spacing(3),
      display: "flex",
      //   flexDirection: "column",

      width: "100%",
      height: "100%",
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
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

interface ITagsVariablesNormalize {
  id: number;
  idGrupoFamiliar: number;
  nombre_familiar: string;
  placa: string;
  tipo_tag: string;
  monto: number;
  fecha_pago: string;
}

const extractData = (data: IResultQueryTags[]): ITagsVariablesNormalize[] => {
  return isNotNilOrEmpty(data)
    ? data.map(({ id, tag, vehiculo }) => {
        return {
          id,
          idGrupoFamiliar: vehiculo.grupoFamiliar.id!,
          nombre_familiar: vehiculo.grupoFamiliar.nombre_familiar,
          placa: vehiculo.placa,
          tipo_tag: tag.valorTag.tipo_tag,
          monto: tag.monto,
          fecha_pago: tag.fecha_pago,
        };
      })
    : [];
};

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["nombre_familiar", "placa"],
};

const getRowId = prop("id");

const MantenimientoParentescoListado = () => {
  const classes = useStyles();
  //   const router = useRouter();
  const { data, loading, error, refetch } = useListaTags();
  const [dataTag, setDataTag] = useState<ITagsVariablesNormalize[]>([]);
  const [search, setSearch] = useState<string>("");
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const debounceSearch = useDebounce(search, 300);
  const [idGrupoFamiliarFilter, setIdGrupoFamiliarFilter] = useState<
    number | undefined
  >();

  const [idValorTagFilter, setValorTagFilter] = useState<number | undefined>();

  const {
    data: dataListadoGrupoFamiliar,
    loading: loadingListadoGrupoFamiliar,
    error: errorListadoGrupoFamiliar,
  } = useListarGrupoFamiliar();

  const {
    data: dataValorTag,
    loading: loadingValorTag,
    error: errorValorTag,
  } = useListadoValorTag();

  useEffect(() => {
    if (isNotNilOrEmpty(data) && !loading) {
      setDataTag(extractData(data?.ListaTags!));
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
      columns: columnsTags,
      data: dataTag,
      getRowId,
      //   onEdit,
      //   onDelete,
    },
    usePagination
  );

  const fuse = useMemo(() => {
    if (isNotNilOrEmpty(data)) {
      const myIndex = Fuse.createIndex(
        optionsFuse.keys!,
        extractData(data?.ListaTags!)
      );
      return new Fuse(extractData(data?.ListaTags!), optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataTag(result);
    } else {
      setDataTag(extractData(data?.ListaTags!));
    }
  }, [debounceSearch]);

  const onChangePage = useCallback((event, page) => gotoPage(page), [gotoPage]);

  const onChangeRowsPerPage = useCallback(
    (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
    [setPageSize]
  );

  const filtrar = useCallback(() => {
    if (idGrupoFamiliarFilter && idValorTagFilter && data && data.ListaTags) {
      const result = data.ListaTags.filter(
        ({ vehiculo, tag }) =>
          vehiculo.grupoFamiliar.id === idGrupoFamiliarFilter ||
          tag.valorTag.id === idValorTagFilter
      );
      setDataTag(extractData(result));
    } else if (idGrupoFamiliarFilter && data && data.ListaTags) {
      const result = data.ListaTags.filter(
        ({ vehiculo }) => vehiculo.grupoFamiliar.id === idGrupoFamiliarFilter
      );
      setDataTag(extractData(result));
    } else if (idValorTagFilter && data && data.ListaTags) {
      const result = data.ListaTags.filter(
        ({ tag }) => tag.valorTag.id === idValorTagFilter
      );
      setDataTag(extractData(result));
    }
  }, [idGrupoFamiliarFilter, idValorTagFilter, data]);
  //   }, [idGrupoFamiliarFilter, data,setDataTag]);

  const reset = useCallback(() => {
    if (!loading && data) {
      setDataTag(extractData(data?.ListaTags!));
    }
  }, [loading, data]);

  return (
    <AppLayout>
      <>
        {openModalMsj && (
          <ModalAuth
            openModal={openModalMsj}
            setOpenModal={setOpenModalMsj}
            title={titleModalMsj}
            message={mensajeModalMsj}
            error={errorModal}
          />
        )}
      </>
      <Paper className={classes.root}>
        <div className={classes.containerTitle}>
          <Typography variant="overline" className={classes.title}>
            Listado de TAGs de los Vehiculos
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
        </div>
        <Divider />
        <div className={classes.contenFilter}>
          <div
            style={{ justifyContent: "space-between" }}
            className={classes.contentForm}
          >
            {/* <div> */}
            <div>
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
              <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="idValorTag_label">Tipo Tag</InputLabel>
                <Select
                  className={classes.selectFilter}
                  labelId="idValorTag_label"
                  value={idValorTagFilter}
                  onChange={(e) => setValorTagFilter(e.target.value as number)}
                >
                  <MenuItem value={undefined}> - Deseleccionar - </MenuItem>

                  {!loadingValorTag &&
                    dataValorTag &&
                    isNotNilOrEmpty(dataValorTag.ListaValorTag) &&
                    dataValorTag.ListaValorTag.map(({ id, tipo_tag }) => {
                      return (
                        <MenuItem value={id} key={"ListadoTagFilterTag" + id}>
                          {tipo_tag}
                        </MenuItem>
                      );
                    })}
                  {/* {!loadingListadoGrupoFamiliar &&
                    isNotNilOrEmpty(dataListadoGrupoFamiliar) &&
                    dataListadoGrupoFamiliar?.ListaGruposFamiliares.map(
                      ({ id, nombre_familiar }) => {
                        return (
                          <MenuItem
                            value={id}
                            key={"ListadoTagFilterTag" + id}
                          >
                            {nombre_familiar}
                          </MenuItem>
                        );
                      }
                    )} */}
                </Select>
              </FormControl>
            </div>

            {/* </div> */}
          </div>
          <div>
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
          lengthData={isNilOrEmpty(dataTag) ? 0 : dataTag.length}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Paper>
    </AppLayout>
  );
};

export default MantenimientoParentescoListado;
