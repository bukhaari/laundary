import TextError from "./textError";
import { ErrorMessage, FastField } from "formik";
import {
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
} from "@material-ui/core";

function BaseCheckBox(props) {
  const {
    name,
    row = true,
    label,
    options = [],
    formLabel,
    value,
    onChange,
    parentclass,
  } = props;

  return (
    <div className={parentclass}>
      <FastField name={name}>
        {({ field }) => {
          return (
            <FormControl>
              <FormLabel>{formLabel}</FormLabel>
              <RadioGroup row={row}>
                {options.length > 0 ? (
                  options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox />}
                      label={option.label}
                      {...field}
                      value={option.value}
                    />
                  ))
                ) : value ? (
                  <FormControlLabel
                    control={<Checkbox />}
                    label={label}
                    {...field}
                    value={value}
                  />
                ) : (
                  <FormControlLabel
                    control={<Checkbox />}
                    label={label}
                    {...field}
                  />
                )}
              </RadioGroup>
            </FormControl>
          );
        }}
      </FastField>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default BaseCheckBox;
