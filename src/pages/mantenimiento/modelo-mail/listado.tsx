import {
  makeStyles,
  createStyles,
  colors,
  Paper,
  Table,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { prop, isNil, pluck } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import AppLayout from "../../../components/layout/app-layout";
import { columnsModeloMail } from "../../../components/mantenimento/modelo-mail/modelo-mail-dataTable";
import {
  useListaModeloMailQuery,
  IResultQueryModeloMail,
} from "../../../components/mantenimento/modelo-mail/use-modelo-mail";
import { columnsValorTag } from "../../../components/mantenimento/valor-tag/valor-tag-dataTable";
import { isNilOrEmpty, isNotNilOrEmpty } from "../../../utils/is-nil-empty";
import useDebounce from "../../../utils/useDebounce";
import Fuse from "fuse.js";
import ModalAuth from "../../../components/core/input/dialog/modal-dialog";
import CardTableBody from "../../../components/table/table-body";
import TableHeader from "../../../components/table/table-header";
import TablePaginations from "../../../components/table/table-paginations";
import { TipoUsuario } from "../../../components/core/input/dateSelect";
import PermisoLayout from "../../../components/layout/auth-layout/permiso-layout";
import NavBar from "../../../components/layout/app-bar";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // marginTop: theme.spacing(2),
      // marginBottom: theme.spacing(2),
      borderRadius: "12px",
      width: "50%",
      margin: theme.spacing(2),
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
    containerRoot: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      margin: theme.spacing(2),
    },

    containerTitle: {
      // backgroundColor: "red",
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    title: {
      fontSize: theme.typography.pxToRem(14),
      backgroundColor: colors.grey[200],
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      borderRadius: 5,
    },
  })
);

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["categoria"],
};
const getRowId = prop("id");

const MantenimientoModeloMailListado = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error, refetch } = useListaModeloMailQuery();
  const [search, setSearch] = useState<string>("");
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const debounceSearch = useDebounce(search, 300);

  const [dataModeloMail, setDataModeloMail] = useState<
    IResultQueryModeloMail[]
  >([]);

  useEffect(() => {
    if (!loading && data && isNotNilOrEmpty(data.ListaModeloMail)) {
      setDataModeloMail(data.ListaModeloMail!);
    }
  }, [data, loading, error]);

  const onEdit = useCallback(
    ({ id }: any) => {
      if (!isNil(id)) {
        router.push(
          { pathname: "/mantenimiento/modelo-mail/[id]" },
          `/mantenimiento/modelo-mail/${encodeURIComponent(id)}`
        );
      }
    },
    [router]
  );

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
      columns: columnsModeloMail,
      data: dataModeloMail,
      getRowId,
      onEdit,
    },
    usePagination
  );

  const fuse = useMemo(() => {
    if (data && isNotNilOrEmpty(data.ListaModeloMail)) {
      const myIndex = Fuse.createIndex(
        optionsFuse.keys!,
        data.ListaModeloMail!
      );
      return new Fuse(data.ListaModeloMail!, optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setDataModeloMail(result);
    } else {
      setDataModeloMail(data?.ListaModeloMail ?? []);
    }
  }, [data?.ListaModeloMail, debounceSearch, fuse]);

  const onChangePage = useCallback((event, page) => gotoPage(page), [gotoPage]);

  const onChangeRowsPerPage = useCallback(
    (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
    [setPageSize]
  );

  return (
    <>
      <PermisoLayout tipoUsuarioRecibido={[TipoUsuario.ADMIN]}>
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
          {/* <div className={classes.containerTitle}>
            <Typography variant="overline" className={classes.title}>
              Modelos de correos
            </Typography>
          </div> */}
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
            lengthData={
              isNilOrEmpty(dataModeloMail) ? 0 : dataModeloMail.length
            }
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            pageIndex={pageIndex}
            pageSize={pageSize}
          />
        </Paper>
      </PermisoLayout>
    </>
  );
};

MantenimientoModeloMailListado.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Listado de Modelos de Correos">
        {page}
      </AppLayout>
      ;
    </>
  );
};

export default MantenimientoModeloMailListado;
