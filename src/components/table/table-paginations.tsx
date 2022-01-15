import { CardActions, TablePagination } from "@material-ui/core";
import { FC } from "react";

interface IProps {
  lengthData: number;
  pageSize: any;
  pageIndex: any;
  onChangePage: (event: any, page: any) => any;
  onChangeRowsPerPage: (event: any, rowsPerPage: any) => any;
}

const TablePaginations: FC<IProps> = ({
  lengthData,
  onChangePage,
  onChangeRowsPerPage,
  pageIndex,
  pageSize,
}) => {
  return (
    <CardActions>
      <TablePagination
        component="div"
        count={lengthData}
        page={pageIndex}
        rowsPerPage={pageSize}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        rowsPerPageOptions={[
          5,
          10,
          25,
          { label: "All", value: Number(lengthData) },
        ]}
      />
    </CardActions>
  );
};

export default TablePaginations;
