import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { Row } from "react-table";
import IconButton from "@material-ui/core/IconButton";
import { TrashCan as TrashCanIcon } from "mdi-material-ui";

interface IProps {
  className?: string;
  onDelete: any;
  row: Row;
}

const ActionsUsuarioCellEditDelete: React.FC<IProps> = ({
  onDelete,
  row,
  className,
}) => {
  return (
    <Tooltip className={className} title={"Editar"}>
      <Tooltip title="Eliminar" placement="top">
        <IconButton
          // variant="text"
          color="primary"
          onClick={() => onDelete(row.original)}
        >
          <TrashCanIcon />
        </IconButton>
      </Tooltip>
    </Tooltip>
  );
};

export default ActionsUsuarioCellEditDelete;
