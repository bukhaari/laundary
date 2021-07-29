import FormControl from "../../components/controls/FormControl";
import React, { memo, useState } from "react";
import BaseTable from "../../components/controls/BaseTable";
import SelectService from "./selectService";
import {
  Card,
  CardContent,
  makeStyles,
  Button,
  Checkbox,
  TextField,
} from "@material-ui/core";

const useStyle = makeStyles((them) => ({
  field: {
    width: "90px",
  },
}));

function Service(props) {
  const { handleservice, service } = props;

  let Header = [
    { field: "itemName", headerName: "Item" },
    { field: "qty", headerName: "Qty" },
    { field: "amount", headerName: "amount" },
  ];
  // const serviceItems = [
  //   { value: "washing", label: "Washing" },
  //   { value: "ironing", label: "Ironing" },
  //   { value: "ExWashing", label: "Ex-Washing" },
  //   { value: "ExIroning", label: "Ex-Ironing" },
  // ];

  // const [checked, setChecked] = useState(false);
  // const taggleCheckbox = (e) => {
  //   setChecked(e.target.checked);
  //   // console.log(data);
  // };

  return (
    <div>
      <SelectService handleservice={handleservice} />
      <BaseTable header={Header} items={service} />
    </div>
  );
}

export default Service;
