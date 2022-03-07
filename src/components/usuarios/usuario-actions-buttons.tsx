import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { Row } from "react-table";

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
      <>
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

export default ActionsUsuarioCellEditDelete;
