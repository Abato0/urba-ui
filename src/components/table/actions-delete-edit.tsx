import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { Row } from "react-table";

interface IProps {
  className?: string;
  onEdit: any;
  onDelete: any;
  row: Row;
}

const ActionsCellEditDelete: React.FC<IProps> = ({
  onEdit,
  onDelete,
  row,
  className,
}) => {
  return (
    <Tooltip className={className} title={"Editar"}>
      <>
        <Button
          variant="text"
          color="secondary"
          onClick={() => onEdit(row.original)}
        >
          Editar
        </Button>
        <Button
          variant="text"
          color="secondary"
          onClick={() => onDelete(row.original)}
        >
          Eliminar
        </Button>
      </>
    </Tooltip>
  );
};

export default ActionsCellEditDelete;
