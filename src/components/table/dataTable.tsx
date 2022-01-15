/* eslint-disable react/jsx-key */
import React from "react";
import {
  Button,
  Typography,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  makeStyles,
  createStyles,
  colors,
} from "@material-ui/core";
import { Data } from "../core/input/data";
import { useTable, usePagination, Row, Column } from "react-table";
import { isEmpty, isNil, length, prop } from "ramda";
import { pluck } from "ramda";
import Fuse from "fuse.js";
import useDebounce from "../../utils/useDebounce";
import { ExportTablePdf } from "./export-table-pdf";
import { useRouter } from "next/router";
import CardTable from "./card-table";

interface IProps {
  data: any[];
  head: Column<any>[];
  idTable: string;
  titlePdf: string;
  columnsPdf: string[];
  optionsFuse: Fuse.IFuseOptions<any>;
  getRowId: any;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: "12px",
      // backgroundColor:"red",
      // marginTop: theme.spacing(20),
      // minWidth: "320px",
      // width: "100%",
      // height: "100%",
      // marginTop: theme.spacing(2)
    },
    contentButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      padding: theme.spacing(2),
      // height: "56px"
      // marginTop: theme.spacing(5),
    },
    button: {
      marginTop: theme.spacing(1),
      height: "100%",
      backgroundColor: colors.blueGrey[900],
      "&:hover": {
        backgroundColor: colors.blueGrey[800],
      },
    },
    textBox: {
      backgroundColor: "",
    },
    // form: {
    //   display: "flex",
    //   flexDirection: "column",
    //   // backgroundColor: "red",
    //   marginTop: theme.spacing(6),
    // },
  })
);

const DataTable: React.FC<IProps> = ({
  data,
  head: columns,
  getRowId,
  columnsPdf,
  titlePdf,
  idTable,
  optionsFuse,
}) => {
  const [search, setSearch] = React.useState<string>("");
  const router = useRouter();
  const [dataTable, setDataTable] = React.useState<any[]>(data);

  const fuse = React.useMemo(() => {
    if (!isEmpty(data) && !isNil(data)) {
      const myIndex = Fuse.createIndex(optionsFuse.keys!, data);
      return new Fuse(data, optionsFuse, myIndex);
    }
  }, [data]);

  const debounceSearch = useDebounce(search, 300);

  React.useEffect(() => {
    if (!isEmpty(debounceSearch) && !isNil(debounceSearch) && !isNil(fuse)) {
      const result = pluck("item", fuse.search(String(debounceSearch)));
      setDataTable(result);
    } else {
      setDataTable(data);
    }
  }, [debounceSearch]);

  const onEdit = ({ id }: any) => {
    // Navigate to corresponding filing wizard page to resume filing draft
    if (!isNil(id)) {
      router.push(
        { pathname: "/grupo-familiar/registrar/[id]" },
        `/grupo-familiar/registrar/${encodeURIComponent(id)}`
      );
    }
  };

  const onDelete = ({ id }: any) => {
    console.log("data onDelete:", id);
  };

  const classes = useStyles();

  return (
    <>
      <CardTable
        columns={columns}
        dataTable={dataTable}
        // data={data}
        getRowId={getRowId}
        onEdit={onEdit}
        onDelete={onDelete}
        idTable={idTable}
        titlePdf={titlePdf}
        columnsPdf={columnsPdf}
        search={search}
        setSearch={setSearch}
        lengthData={data.length}
      />
    </>
  );
};

export default DataTable;
