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
import { arrMeses } from "../dateSelect";
import { SelectHeader } from "./select-header";

interface IProps {
  handleChange: any;
  value?: string;
  id: string;
  label: string;
}

export const SelectMeses: React.FC<IProps> = ({
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
      {arrMeses.map((mes) => {
        return (
          <MenuItem value={mes} key={id + "Mes-" + mes}>
            {mes}
          </MenuItem>
        );
      })}
    </SelectHeader>
  );
};
