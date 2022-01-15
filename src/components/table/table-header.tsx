import {
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { FC } from "react";
import { HeaderGroup } from "react-table";

interface IProps {
  headerGroups: HeaderGroup<any>[];
}

const TableHeader: FC<IProps> = ({ headerGroups }) => {
  return (
    <>
      <TableHead >
        {headerGroups.map((headerGroup) => (
          <TableRow
            // key={"tableHeader" + ìndex}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
    </>
  );
};

export default TableHeader;
