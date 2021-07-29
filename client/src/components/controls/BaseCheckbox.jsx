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
    formLabel,
    value,
    onChange,
    parentclass,
    checked,
  } = props;

  return (
    <div className={parentclass}>
      <FormControl>
        <FormLabel>{formLabel}</FormLabel>
        <FormControlLabel
          control={<Checkbox checked={checked} />}
          label={label}
          value={value}
          onChange={(e) => onChange(e)}
        />
      </FormControl>
    </div>
  );
}

export default BaseCheckBox;
