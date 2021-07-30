import TextError from "./textError";
import { Field, ErrorMessage } from "formik";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@material-ui/core";

function RadioBoxGroupField(props) {
  const { name, items, row = true, formLabel, parentclass } = props;

  return (
    <div className={parentclass}>
      <Field name={name}>
        {({ field }) => {
          return (
            <div className={parentclass}>
              <FormControl>
                <FormLabel>{formLabel}</FormLabel>
                <RadioGroup row={row}>
                  {items.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Radio />}
                      label={item.label}
                      checked={item.checked}
                      {...field}
                      value={item.value}
                    />
                  ))}
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

export default RadioBoxGroupField;
