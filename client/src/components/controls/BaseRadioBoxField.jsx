import TextError from "./textError";
import { Field, ErrorMessage } from "formik";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@material-ui/core";

function BaseRadioBox(props) {
  const { name, row = true, label, formLabel, parentclass } = props;

  return (
    <div className={parentclass}>
      <Field name={name}>
        {({ field }) => {
          return (
            <div className={parentclass}>
              <FormControl>
                <FormLabel>{formLabel}</FormLabel>
                <RadioGroup row={row}>
                  <FormControlLabel
                    control={<Radio />}
                    label={label}
                    {...field}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          );
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
}

export default BaseRadioBox;
