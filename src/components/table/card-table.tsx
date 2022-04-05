import {
  Paper,
  TextField,
  TableContainer,
  colors,
  makeStyles,
  createStyles,
  Table,
  Button,
} from "@material-ui/core";
import { FC, useCallback } from "react";
import {
  Column,
  Row,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table";

import { ExportTablePdf } from "./export-table-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TableHeader from "./table-header";
import CardTableBody from "./table-body";
import TablePaginations from "./table-paginations";
import IndeterminateCheckbox from "./checkbox-cell";
import Typography from "@material-ui/core/Typography";
import { faFileExcel, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, IconButton } from "@material-ui/core";

import { FileExcelBox as FileExcelBoxIcon } from "mdi-material-ui";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // marginTop: theme.spacing(2),
      // marginBottom: theme.spacing(2),
      borderRadius: "12px",
      margin: "30px",
      width: "80%",
      // maxWidth: "1100px",
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
      maxHeight: theme.spacing(6),
      padding: theme.spacing(3),
      // minWidth: 100,
      // maxHeight: 40,
    },
    textBox: {
      backgroundColor: "",
      width: theme.spacing(40),
      marginTop: theme.spacing(2),
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
      // backgroundColor: colors.grey[200],
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
  checkbox?: boolean;
  orientacion?: "landscape" | "portrait";
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
  checkbox = false,
  orientacion = "portrait",
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
    state: { pageIndex, pageSize, selectedRowIds },
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
            placeholder={"Buscar"}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
          />
          {/* </div> */}

          <div
            style={{
              // backgroundColor: "red",
              // minWidth: 200,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <ExportTablePdf
              classes={classes.button}
              idTable={idTable}
              title={titlePdf}
              columns={columnsPdf}
              orientacion={orientacion}
            />
            <Tooltip title="Exportar a Excel">
              <IconButton>
                <FileExcelBoxIcon
                  fontSize="large"
                  style={{
                    color: colors.green[800],
                  }}
                  onClick={ExportExcel}
                />
              </IconButton>
            </Tooltip>
            {/* <Button
              className={classes.button}
              variant="contained"
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
            </Button> */}
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
