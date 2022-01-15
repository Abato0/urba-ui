import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { Row } from "react-table";

interface IProps {
  className?: string;
  onSeeImg: any;
  row: Row;
}

const VisualizarActionsCell: React.FC<IProps> = ({ onSeeImg, row, className }) => {
  return (
    <Tooltip className={className} title={"Editar"}>
      <>
        <Button
          variant="text"
          color="secondary"
          onClick={() => onSeeImg(row.original)}
        >
          Visualizar
        </Button>
      </>
    </Tooltip>
  );
};

export default VisualizarActionsCell;
