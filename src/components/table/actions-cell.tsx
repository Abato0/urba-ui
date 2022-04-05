import React from "react";
import { Button, IconButton, Tooltip } from "@material-ui/core";
import { Row } from "react-table";
import { FileEdit as FileEditIcon } from "mdi-material-ui";

interface IProps {
  className?: string;
  onEdit: any;
  onDelete: any;
  row: Row;
}

const ActionsCell: React.FC<IProps> = ({
  onEdit,
  onDelete,
  row,
  className,
}) => {
  return (
    <Tooltip className={className} placement="right" title={"Editar"}>
      <IconButton onClick={() => onEdit(row.original)}>
        <FileEditIcon color="primary" />
        {/* <Button
        variant="text"
        color="secondary"
        onClick={() => onEdit(row.original)}
      >
        Editar
      </Button> */}
      </IconButton>
    </Tooltip>
  );
};

export default ActionsCell;
