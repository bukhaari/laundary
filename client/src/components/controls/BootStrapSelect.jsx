const {
  InputLabel,
  NativeSelect,
  FormControl,
  TextField,
} = require("@material-ui/core");
const { default: BootstrapInput } = require("./BootstrapInput");

const BootstrapSelect = ({
  label,
  items,
  name,
  itemValue = "value",
  itemText = "text",
  ...rest
}) => {
  // return (
  //   <FormControl fullWidth>
  //     <InputLabel htmlFor="demo-customized-select-native">{label}</InputLabel>
  //     <NativeSelect
  //       fullWidth
  //       name={name}
  //       variant="outlined"
  //       id="demo-customized-select-native"
  //       {...rest}
  //       input={<BootstrapInput />}
  //     >
  //       <option aria-label="None" value="" />
  //       {items.map((item) => (
  //         <option key={item[itemValue]} value={item[itemValue]}>
  //           {item[itemText]}
  //         </option>
  //       ))}
  //     </NativeSelect>
  //   </FormControl>
  // );
  return (
    <TextField
      id="outlined-select-currency-native"
      select
      label={label}
      {...rest}
      fullWidth
      SelectProps={{
        native: true,
      }}
      variant="outlined"
    >
      <option aria-label="None" value="" />
      {items.map((item) => (
        <option key={item[itemValue]} value={item[itemValue]}>
          {item[itemText]}
        </option>
      ))}
    </TextField>
  );
};

export default BootstrapSelect;
