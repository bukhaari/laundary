import { TextField } from "@material-ui/core";
import { useEffect } from "react";
import { memo } from "react";
// import { useState } from "react";

const BaseInput = ({rules = [],setRule,items = [],deps = [],itemValue = "value",itemText = "text", ...rest}) => {
  useEffect(() => {
    if (typeof setRule === "function") setRule(rules, rest.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
  return (
    <TextField
      size="small"
      SelectProps={{
        native: true,
      }}
      {...rest}
    >
      <option value="" />
      {items.map((item) => (
        <option key={item[itemValue]} value={item[itemValue]}>
          {item[itemText]}
        </option>
      ))}
    </TextField>
  );
};

export default memo(BaseInput);
