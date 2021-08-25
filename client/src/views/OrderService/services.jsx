import { FormikStep } from "../../components/common/Stepper";
import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import BaseTable from "../../components/controls/BaseTable";
import SelectService from "./selectService";
import { makeStyles, IconButton, Grid, InputBase } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Brightness1Icon from "@material-ui/icons/Brightness1";

const useStyle = makeStyles((theme) => ({
  button: {
    color: "red",
  },
  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
    // margin: theme.spacing(3),
  },
}));

function Service(props) {
  const classes = useStyle();
  const { handleservice, serviceOrder } = props;

  let Header = [
    { field: "itemName", headerName: "Item" },
    { field: "qty", headerName: "Qty" },
    { field: "amount", headerName: "amount" },
    { field: "total", headerName: "Total" },
    { field: "color", headerName: "Color" },
    { field: "delete", headerName: "Delete" },
  ];

  const [checkBoxes, seCheck] = useState([]);
  const [QtyAmountState, setQtyAmountState] = useState([]);
  const [ColorState, setColorState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id) => {
    let checks = checkBoxes.filter((item) => item.Cid !== id);
    seCheck((prev) => {
      return [...checks, { Cid: id, ischeck: false }];
    });

    let services = QtyAmountState.filter((item) => item.Cid !== id);
    const current = QtyAmountState.find((item) => item.Cid === id);
    const upd = { ...current, amount: 0, qty: 1 };
    setQtyAmountState((prev) => {
      return [...services, { Cid: id, ...upd }];
    });
  };

  return (
    <FormikStep>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={9}>
          <SelectService
            setQtyAmountState={setQtyAmountState}
            QtyAmountState={QtyAmountState}
            handleservice={handleservice}
            checkBoxes={checkBoxes}
            ColorState={ColorState}
            setColorState={setColorState}
            seCheck={seCheck}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <InputBase
            placeholder="Searching"
            className={classes.searchInput}
            startAdornment={<SearchIcon />}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12}>
          <BaseTable
            header={Header}
            items={serviceOrder
              .filter((s) => {
                if (searchQuery === "") {
                  return s;
                } else if (
                  s.itemName.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                  return s;
                }
              })
              .map((s) => ({
                ...s,
                delete: (
                  <IconButton
                    className={classes.button}
                    size={"small"}
                    onClick={() => handleDelete(s._id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                ),
                color: s.colors.map((c) => (
                  <Brightness1Icon
                    style={{
                      color: c,
                      marginLeft: "3px",
                      border: "0.3px solid black",
                      borderRadius: "50px",
                    }}
                  />
                )),
              }))}
          />
        </Grid>
      </Grid>
    </FormikStep>
  );
}

export default Service;
