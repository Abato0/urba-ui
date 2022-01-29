import { FormControl, InputLabel, Select } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import React, { ChangeEvent } from "react";

interface IProps {
  value: any;
  classes: ClassNameMap<"textbox" | "formControl">;
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: any;
  labetTitulo: string;
  id: string;
}

const FormControlHeader: React.FC<IProps> = ({
  classes,
  handleBlur,
  handleChange,
  value,
  children,
  id,
  labetTitulo,
}) => {
  return (
    <FormControl variant="filled" className={classes.formControl}>
      <InputLabel id={id + "_label"}>{labetTitulo}</InputLabel>
      <Select
        labelId={id + "_label"}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.textbox}
        required
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default FormControlHeader;
