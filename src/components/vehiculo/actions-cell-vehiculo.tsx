import { Button, Tooltip } from "@material-ui/core";
import React from "react";
import { Row } from "react-table";

interface IProps {
  className?: string;
  onEdit: any;
  onDescargar: any;
  row: Row;
}

const ActionsCellVehiculo: React.FC<IProps> = ({
  onEdit,
  onDescargar,
  row,
  className,
}) => {
  return (
    <Tooltip className={className} title={"Editar"}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          onClick={() => onDescargar(row.original)}
        >
          {/* Descargar */}
          Visualizar
        </Button>
      </div>
    </Tooltip>
  );
};

export default ActionsCellVehiculo;
