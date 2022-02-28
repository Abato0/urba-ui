import { FC } from "react";
import { Row, TableBodyPropGetter, TableBodyProps } from "react-table";
import { Checkbox, TableBody, TableCell, TableRow } from "@material-ui/core";

interface IProps {
  getTableBodyProps: (
    propGetter?: TableBodyPropGetter<any> | undefined
  ) => TableBodyProps;
  page: any;
  prepareRow: (row: Row<any>) => void;
}

const CardTableBody: FC<IProps> = ({ getTableBodyProps, prepareRow, page }) => {
  return (
    <TableBody {...getTableBodyProps()}>
      {page.map((row: Row<any>) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {/* <TableCell padding="checkbox">
              <Checkbox
                checked={true}
                inputProps={{ "aria-labelledby": "labelId" }}
              />
            </TableCell> */}
            {row.cells.map((cell) => {
              return (
                <TableCell align="center" {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default CardTableBody;
