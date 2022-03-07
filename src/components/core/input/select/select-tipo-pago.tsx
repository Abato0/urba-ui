import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { SelectChangeEvent } from "@mui/material";
import React from "react";
import { arrMeses, arrModulos, ArrTipoPago } from "../dateSelect";
import { SelectHeader } from "./select-header";

interface IProps {
  handleChange: any;
  value?: string;
  id: string;
  label: string;
}

export const SelectTipoPago: React.FC<IProps> = ({
  handleChange,
  value,
  id,
  label,
}) => {
  return (
    <SelectHeader
      handleChange={handleChange}
      value={value}
      id={id}
      label={label}
    >
      <MenuItem value={undefined}> - Deseleccionar - </MenuItem>
      {ArrTipoPago.map(({ label, value }) => {
        return (
          <MenuItem value={value} key={id + "TipoPago - " + value}>
            {label}
          </MenuItem>
        );
      })}
    </SelectHeader>
  );
};
