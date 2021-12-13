import { isNotNilOrEmpty } from '../../../utils/is-nil-empty';
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';
import { getIn,FormikErrors } from 'formik';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';


export const getTextFieldProps=({
  disabled,
  field,
  form: { errors, isSubmitting, touched },
  ...props
}:any) =>{
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && isNotNilOrEmpty(fieldError);

  return {
    ...props,
    ...field,
    error: showError,
    helperText: showError ? fieldError : props.helperText,
    disabled: disabled ?? isSubmitting,
    variant: props.variant
  };
}

const propTypes = {
  inputProps: PropTypes.object,
  readOnly: PropTypes.bool,
  children: PropTypes.node
};

// `@material-ui/core/TextField` component with `formik` bindings
// See https://github.com/stackworx/formik-material-ui/blob/master/packages/formik-material-ui/src/TextField.tsx
const TextField = forwardRef(function TextField({ children, inputProps, readOnly, ...props }:any, ref) {
  return (
    <MuiTextField {...getTextFieldProps(props)} inputProps={{ ...inputProps, readOnly }} ref={ref}>
      {children}
    </MuiTextField>
  );
});

// TextField.propTypes = propTypes;
// TextField.displayName = `Formik(${MuiTextField.displayName || MuiTextField.name})`;

export default TextField;
