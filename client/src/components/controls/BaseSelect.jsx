import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  Chip,
  Checkbox,
  ListItemText,
  FormHelperText,
} from "@material-ui/core";
import { useEffect } from "react";
import { memo } from "react";
const useStyles = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
    // color: "black",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    // backgroundColor: "black",
    // color: "white",
    margin: 2,
    color: "black",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function BaseSelect({
  label,
  returnObj,
  setRule,
  helperText,
  name,
  rules = [],
  multiple = false,
  items = [],
  itemValue = "value",
  itemText = "text",
  ...rest
}) {
  const classes = useStyles();

  const isSelected = (value, item) => {
    if (Array.isArray(value)) {
      return !!value.find((val) => {
        if (typeof val === "string") return val === item[itemValue];
        return val[itemValue] === item[itemValue];
      });
    }
    if (typeof value === "object") return item[itemValue] === value[itemValue];
    return value === item[itemValue];
  };
  useEffect(() => {
    if (typeof setRule === "function") setRule(rules, name);
    // console.log(rules, name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   useEffect(() => {
  //     console.log(rest.value);
  //   }, [rest.value]);
  const hadnleChange = (e) => {
    // console.log(helperText);
    // console.log(e.target.value);
    if (returnObj && !multiple)
      rest.onChange({
        persist: e.persist,
        target: {
          value:
            items.find((item) => item[itemValue] === e.target.value) ||
            Object.keys(rest.value).reduce((obj, key) => {
              obj[key] = "";
              return obj;
            }, {}),
        },
      });
    else rest.onChange(e);
  };

  return (
    <FormControl
      error={rest.error}
      fullWidth
      variant="outlined"
      className={classes.formControl}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...rest}
        name={name}
        onChange={hadnleChange}
        value={
          returnObj && !multiple
            ? rest.value[itemValue]
            : multiple
            ? rest.value
            : typeof rest.value === "object"
            ? JSON.stringify(rest.value)
            : rest.value
        }
        label={label}
        multiple={multiple}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {multiple
              ? selected.map((value) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    key={returnObj ? value[itemValue] : value}
                    label={returnObj ? value[itemValue] : value}
                    className={classes.chip}
                    // onDelete={console.log}
                  />
                ))
              : selected}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {!multiple && (
          <MenuItem value="">
            <Checkbox checked={isSelected(rest.value, { [itemValue]: "" })} />
            <ListItemText primary={""} />
          </MenuItem>
        )}
        {items.map((item) => (
          <MenuItem
            key={item[itemValue]}
            value={returnObj && multiple ? item : item[itemValue]}
          >
            <Checkbox checked={isSelected(rest.value, item)} />
            <ListItemText primary={item[itemText]} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

export default memo(BaseSelect);
