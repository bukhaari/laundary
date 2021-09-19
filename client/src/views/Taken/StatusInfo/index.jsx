import * as Yup from "yup";
import Taken from "./taken";
import Missed from "./missed";
import Payment from "./payment";
import React, { useMemo, useState, memo } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Badge, Grid, TextField, makeStyles } from "@material-ui/core";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import SimpleTable from "../../../components/common/SimpleTable";
import PopupDiolog from "../../../components/common/PopUpDiolog";

const useStyles = makeStyles((theme) => ({
  balance: {
    display: "flex",
    justifyContent: "flex-end",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#de040c",
  },
}));

function StatusInfo(props) {
  const {
    Items = [],
    ClientName,
    balance,
    text,
    orderId,
    setOrderList,
    OrderList,
  } = props;

  const [pidBalance, setpidBalance] = useState(0);

  const classes = useStyles();
  let Header = [
    { field: "itemName", headerName: "Item Name" },
    { field: "qty", headerName: "QTY" },
    { field: "color", headerName: "Color" },
  ];

  const AutoComplateData = [
    { title: "Missed", id: 1 },
    { title: "Taken", id: 2 },
    { title: "Payment", id: 3 },
  ];

  const [CheckData, setCheckData] = useState("Ready");
  const handleChangeComplate = (e, values) => {
    if (values != null)
      setCheckData((prev) => {
        return values.title;
      });
  };

  const [modelStatus, setModelStatus] = useState(false);
  const handleModalStatus = () => {
    setModelStatus(!modelStatus);

    setCheckData("Taken");
  };

  let RenderData = useMemo(() => {
    if (CheckData === "Payment")
      return (
        <Payment
          balance={balance}
          setpidBalance={setpidBalance}
          orderId={orderId}
        />
      );
    if (CheckData === "Taken")
      return (
        <Taken
          OrderList={OrderList}
          setOrderList={setOrderList}
          orderId={orderId}
        />
      );
    if (CheckData === "Missed")
      return (
        <Missed
          OrderList={OrderList}
          setOrderList={setOrderList}
          orderId={orderId}
        />
      );
  }, [CheckData]);

  return (
    <div>
      <Badge
        onClick={handleModalStatus}
        color="secondary"
        badgeContent={text}
        style={{ cursor: "pointer" }}
      />

      <PopupDiolog
        title={ClientName}
        OpenPopUp={modelStatus}
        setOpenPopUp={setModelStatus}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <SimpleTable
              header={Header}
              items={Items.map((i) => {
                i.color = i.colors.map((c, index) => (
                  <Brightness1Icon
                    key={index}
                    style={{
                      color: c,
                      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.4)",
                      marginLeft: "3spx",
                      border: "0.3px solid black",
                      borderRadius: "50px",
                    }}
                  />
                ));
                return i;
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className={classes.balance}>
                  Balance: {pidBalance === balance ? 0 : balance - pidBalance}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  options={AutoComplateData}
                  defaultValue={{ title: "Taken", id: 2 }}
                  getOptionLabel={(option) => option.title}
                  onChange={handleChangeComplate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="CheckData"
                      label="Select task"
                      size="small"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {RenderData}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </PopupDiolog>
    </div>
  );
}

export default memo(StatusInfo);
