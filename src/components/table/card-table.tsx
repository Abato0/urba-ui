import {
  Paper,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardActions,
  TablePagination,
  colors,
  makeStyles,
  createStyles,
  Table,
  Button,
} from "@material-ui/core";
import { FC, useCallback } from "react";
import { Column, Row, usePagination, useTable } from "react-table";

import { ExportTablePdf } from "./export-table-pdf";

import TableHeader from "./table-header";
import CardTableBody from "./table-body";
import TablePaginations from "./table-paginations";

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
    // table: {
    //   backgroundColor: colors.grey[600],
    // },
  })
);

interface IProps {
  columns: readonly Column<any>[];
  dataTable: any[];
  //   data: any[];
  getRowId: any;
  onEdit: ({ id }: any) => void;
  onDelete: ({ id }: any) => void;
  idTable: string;
  titlePdf: string;
  columnsPdf: string[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  lengthData: number;
  ExportExcel: () => void;
}

const CardTable: FC<IProps> = ({
  columnsPdf,
  idTable,
  titlePdf,
  columns,
  dataTable,
  //   data,
  getRowId,
  onEdit,
  onDelete,
  search,
  setSearch,
  lengthData,
  ExportExcel,
  children,
}) => {
  const classes = useStyles();
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
      columns,
      data: dataTable,
      getRowId,
      onEdit,
      onDelete,
    },
    usePagination
  );

  const onChangePage = useCallback((event, page) => gotoPage(page), [gotoPage]);

  const onChangeRowsPerPage = useCallback(
    (event, rowsPerPage) => setPageSize(rowsPerPage.props.value, event),
    [setPageSize]
  );

  return (
    <>
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
              color="secondary"
              onClick={ExportExcel}
            >
              Export Excel
            </Button>
          </div>
        </div>
        <>{children}</>

        <TableContainer>
          <Table
            // className={classes.table}
            stickyHeader
            aria-label="sticky table"
            {...getTableProps()}
            id={idTable}
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
          lengthData={lengthData}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          pageIndex={pageIndex}
          pageSize={pageSize}
        />
      </Paper>
    </>
  );
};

export default CardTable;
