import * as Yup from "yup";
import Ready from "./ready";
import Missed from "./missed";
import Payment from "./payment";
import React, { useMemo, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Badge, Grid, TextField } from "@material-ui/core";
import CustomDialog from "../../../components/CustomDialog";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import SimpleTable from "../../../components/common/SimpleTable";

function StatusInfo({ Items = [], ClientName, text }) {
  const [openStatus, setStatus] = useState(false);
  const handleModalStatus = () => {
    setStatus(!openStatus);
  };

  let Header = [
    { field: "itemName", headerName: "Item Name" },
    { field: "qty", headerName: "QTY" },
    { field: "color", headerName: "Color" },
  ];

  const AutoComplateData = [
    { title: "Missed", id: 1 },
    { title: "Ready", id: 2 },
    { title: "Payment", id: 3 },
  ];

  const [CheckData, setCheckData] = useState("Payment");
  const handleChangeComplate = (e, values) => {
    if (values != null)
      setCheckData((prev) => {
        return values.title;
      });
  };

  const RenderData = useMemo(() => {
    if (CheckData === "Payment") return <Payment />;
    if (CheckData === "Ready") return <Ready />;
    if (CheckData === "Missed") return <Missed />;
  }, [CheckData]);

  return (
    <div>
      <Badge
        onClick={handleModalStatus}
        color="secondary"
        badgeContent={text}
        style={{ cursor: "pointer" }}
      />

      <CustomDialog
        title={<div>{ClientName}</div>}
        onClose={handleModalStatus}
        open={openStatus}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "md",
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <Autocomplete
                  id="combo-box-demo"
                  options={AutoComplateData}
                  defaultValue={{ title: "Payment", id: 3 }}
                  getOptionLabel={(option) => option.title}
                renderInput={(params) => ( */}
                <TextField
                  // {...params}
                  onChange={handleChangeComplate}
                  fullWidth
                  name="CheckData"
                  value={CheckData}
                  label="Select task"
                  size="small"
                  variant="outlined"
                  select
                >
                  {AutoComplateData.map((a) => (
                    <option>{a.title}</option>
                  ))}
                </TextField>
                {/* )}
                /> */}
              </Grid>
              <Grid item xs={12}>
                {RenderData}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomDialog>
    </div>
  );
}

export default StatusInfo;
