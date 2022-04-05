import {
  colors,
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { isNil, pluck, prop } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useTable } from "react-table";

import ModalAuth from "../../../components/core/input/dialog/modal-dialog";
import AppLayout from "../../../components/layout/app-layout";
import CardTableBody from "../../../components/table/table-body";
import TableHeader from "../../../components/table/table-header";
import TablePaginations from "../../../components/table/table-paginations";
import {
  isNotNilOrEmpty,
  isNilOrEmpty,
  isNotNil,
} from "../../../utils/is-nil-empty";
import Fuse from "fuse.js";
import useDebounce from "../../../utils/useDebounce";
import { useRouter } from "next/router";
import { columnsColor } from "../../../components/mantenimento/color/color-dataTable";
import {
  IResultQueryColor,
  useListaColorQuery,
  useDeleteColorMutation,
} from "../../../components/mantenimento/color/use-color";
import { IngresarColorForm } from "../../../components/mantenimento/color/color-form";
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
      // fontWeight: "bold",
      // font
    },
  })
);

const extractData = (data: IResultQueryColor[]) => {
  return isNotNilOrEmpty(data) ? data : [];
};

const optionsFuse: Fuse.IFuseOptions<any> = {
  keys: ["color"],
};

interface IColorNormalize {
  color: string;
}

const getRowId = prop("id");

const MantenimientoColorListado = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading, error } = useListaColorQuery();
  const [dataColor, setColorData] = useState<IColorNormalize[]>([]);
  const [search, setSearch] = useState<string>("");
  const [openModalMsj, setOpenModalMsj] = useState<boolean>(false);
  const [titleModalMsj, setTitleModalMsj] = useState<string>("");
  const [mensajeModalMsj, setMensajeModalMsj] = useState<string>("");
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const debounceSearch = useDebounce(search, 300);

  const [mutateEliminar] = useDeleteColorMutation();

  useEffect(() => {
    if (isNotNilOrEmpty(data) && !loading) {
      setColorData(extractData(data?.ListaColor!));
    }
  }, [data, loading, error]);

  const onEdit = useCallback(({ id }: any) => {
    if (!isNil(id)) {
      router.push(
        { pathname: "/mantenimiento/color/registrar/[id]" },
        `/mantenimiento/color/registrar/${encodeURIComponent(id)}`
      );
    }
  }, []);
  const onDelete = useCallback(async ({ id }: any) => {
    try {
      const { data } = await mutateEliminar({
        variables: {
          id,
        },
      });
      if (isNotNil(data)) {
        const { message } = data.DeleteColor;
        setTitleModalMsj(message);
        setErrorModal(false);
        setOpenModalMsj(true);
      } else {
        setTitleModalMsj("Usuario no autorizado");
        setErrorModal(true);
        setOpenModalMsj(true);
      }
    } catch (error: any) {
      setTitleModalMsj("Envio Fallido");
      setErrorModal(true);
      setMensajeModalMsj("" + error.message);
      setOpenModalMsj(true);
    }
  }, []);

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
      columns: columnsColor,
      data: dataColor,
      getRowId,
      onEdit,
      onDelete,
    },
    usePagination
  );

  const fuse = useMemo(() => {
    if (isNotNilOrEmpty(data)) {
      const myIndex = Fuse.createIndex(
        optionsFuse.keys!,
        extractData(data?.ListaColor!)
      );
      return new Fuse(extractData(data?.ListaColor!), optionsFuse, myIndex);
    }
  }, [data]);

  useEffect(() => {
    if (isNotNilOrEmpty(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      // console.log("result:", fuse.search(String(debounceSearch)));
      setColorData(result);
    } else {
      setColorData(extractData(data?.ListaColor!));
    }
  }, [data?.ListaColor, debounceSearch, fuse]);

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
        <div
          style={{ justifyContent: "space-around" }}
          className={classes.containerRoot}
        >
          <div>
            <IngresarColorForm />
          </div>

          <Paper className={classes.root}>
            <div className={classes.containerTitle}>
              <Typography variant="overline" className={classes.title}>
                Listado de Colores
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
              lengthData={isNilOrEmpty(dataColor) ? 0 : dataColor.length}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
              pageIndex={pageIndex}
              pageSize={pageSize}
            />
          </Paper>
        </div>
      </PermisoLayout>
    </>
  );
};

MantenimientoColorListado.getLayout = function getLayout(
  page: React.ReactElement
) {
  return (
    <>
      <NavBar />
      <AppLayout titulo="Mantenimiento - Colores">{page}</AppLayout>;
    </>
  );
};

export default MantenimientoColorListado;
