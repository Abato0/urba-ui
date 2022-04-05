import { colors, FormControl, InputLabel, Select } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import React, { ChangeEvent } from "react";

interface IProps {
  value: any;
  classes: ClassNameMap<"textbox" | "formControl">;
  handleChange: (e: ChangeEvent<any>) => void;
  handleBlur: any;
  labetTitulo: string;
  id: string;
  disabled?: boolean;
}

const FormControlHeader: React.FC<IProps> = ({
  classes,
  handleBlur,
  handleChange,
  value,
  children,
  id,
  labetTitulo,
  disabled = false,
}) => {
  return (
    <FormControl variant="filled" className={classes.formControl}>
      <InputLabel
        id={id + "_label"}
         style={{ fontSize: "12px" }}
      >
        {labetTitulo}
      </InputLabel>
      <Select
        labelId={id + "_label"}
       // style={{ backgroundColor: colors.deepPurple[50] }}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.textbox}
        required
        disabled={disabled}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default FormControlHeader;
