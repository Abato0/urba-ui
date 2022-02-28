import { colors, TableCell, TableHead, TableRow } from "@material-ui/core";
import { FC } from "react";
import { HeaderGroup } from "react-table";

interface IProps {
  headerGroups: HeaderGroup<any>[];
}

const TableHeader: FC<IProps> = ({ headerGroups }) => {
  return (
    <>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow
            {...headerGroup.getHeaderGroupProps()}
            // key={"tableHeader" + ìndex}
          >
            {headerGroup.headers.map((column) => (
              <TableCell
                style={{
                  // backgroundColor: colors.lightGreen[500],
                  fontSize: 14,
                  fontWeight: "bold",
                  fontFamily: "Roboto",
                  // color:"white"
                }}
                align="center"
                {...column.getHeaderProps()}
              >
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
