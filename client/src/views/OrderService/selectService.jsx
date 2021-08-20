import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllService, loadServices } from "../../store/modules/service";
import FormControl from "../../components/controls/FormControl";
import BaseTable from "../../components/controls/BaseTable";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import {
  TextField,
  Checkbox,
  makeStyles,
  Button,
  List,
  Box,
  Grid,
  ListItemText,
  ListItem,
} from "@material-ui/core";
import CustomDialog from "../../components/CustomDialog";
import { SketchPicker } from "react-color";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "black",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  order: {
    margin: theme.spacing(1, 0, 1),
  },
}));

export default function NewOrder(props) {
  const {
    handleservice,
    seCheck,
    checkBoxes,
    setQtyAmountState,
    QtyAmountState,
    setColorState,
    ColorState,
  } = props;

  const classes = useStyles();

  const ServicesData = useSelector(getAllService);
  const dispatch = useDispatch();

  let Header = [
    { field: "check", headerName: "" },
    { field: "item", headerName: "Item" },
    { field: "qty", headerName: "Qty" },
    { field: "price", headerName: "Price" },
    { field: "color", headerName: "Color" },
  ];

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [currenColorId, setCurrenColorId] = useState(0);
  const [openColor, setOpenColor] = React.useState(false);
  const handleModalColor = (id) => {
    setOpenColor(!openColor);
    setCurrenColorId((prev) => id);
    console.log("color id", id);
  };

  useEffect(async () => {
    await dispatch(loadServices());
  }, []);

  const serviceItems = [
    { value: "washing", label: "Washing" },
    { value: "ironing", label: "Ironing" },
    { value: "ExWashing", label: "Ex-Washing" },
    { value: "ExIroning", label: "Ex-Ironing" },
  ];

  const CreateCheckState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        ischeck: false,
      };
    });

  const CreatetQtyAmountState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        amount: 0,
        qty: 1,
      };
    });

  const CreatetColortState = async () =>
    await ServicesData.map((s) => {
      return {
        _id: s._id,
        color: "#000",
        colors: [],
      };
    });

  useEffect(() => {
    const handleValues = async () => {
      const checkboxState = await CreateCheckState();
      const qtyAmountNewSatet = await CreatetQtyAmountState();
      const newColorSatet = await CreatetColortState();
      setQtyAmountState(qtyAmountNewSatet);
      seCheck(checkboxState);
      setColorState(newColorSatet);
    };

    handleValues();
  }, [ServicesData]);

  const [typeService, setTypeService] = useState("washing");
  const onChangeTypeService = (e) => {
    //change service Type. radio Button onChange Here!.
    setTypeService(e.target.value);

    //change the value of amount in service.
    let services = QtyAmountState.filter((item) => item.amount > 0);

    let upServices = [];
    let upd = [];
    if (services.length > 0) {
      for (let item of services) {
        const typeAmount = ServicesData.find((s) => s._id === item.Cid);
        upd = [
          ...upd,
          { ...item, amount: parseInt(typeAmount[e.target.value]) },
        ];
        // console.log("upd", upd);
        upServices = QtyAmountState.filter((s) => s.amount == 0);
      }
      setQtyAmountState((prev) => {
        return [...upServices, ...upd];
      });
    }
  };

  const handleChangeCheck = (e, id, data) => {
    // change checkbox
    let checks = checkBoxes.filter((item) => item.Cid !== id);
    seCheck((prev) => {
      return [...checks, { Cid: id, ischeck: e.target.checked }];
    });

    // change amount
    let upd = {};
    let current = {};
    if (!data.check.props.checked) {
      let services = QtyAmountState.filter((item) => item.Cid !== id);
      current = QtyAmountState.find((item) => item.Cid === id);
      upd = { ...current, amount: parseInt(data[typeService]), qty: 1 };
      setQtyAmountState((prev) => {
        return [...services, upd];
      });
    }

    if (data.check.props.checked) {
      let services = QtyAmountState.filter((item) => item.Cid !== id);
      current = QtyAmountState.find((item) => item.Cid === id);
      upd = { ...current, amount: 0, qty: 1 };
      setQtyAmountState((prev) => {
        return [...services, { Cid: id, ...upd }];
      });
    }
  };

  const handleQtyAmountState = (e, id) => {
    let services = QtyAmountState.filter((item) => item.Cid !== id);
    let current = QtyAmountState.find((item) => item.Cid === id);
    const upd = { ...current, [e.target.name]: parseInt(e.target.value) };
    setQtyAmountState([...services, upd]);
  };

  const handleComplateColor = (color, row) => {
    console.log("row", row);
    // console.log("Id color", id);
    let AllColorState = ColorState.filter((item) => item._id !== row._id);
    let current = ColorState.find((item) => item._id === row._id);
    // console.log("AllColorState", AllColorState);
    console.log("current", current);

    const upd = {
      ...current,
      color: color.hex,
      colors: [...current.colors, color.hex],
    };
    setColorState((prevColor) => [...AllColorState, upd]);
    console.log("ColorState", ColorState);
  };

  const getcheckState = (id) => {
    let c = checkBoxes.find((k) => k.Cid == id);
    return c;
  };

  const getColorState = (id) => {
    let c = ColorState.find((c) => c._id == id);
    return c;
  };

  const getQtyAmountState = (id) => {
    let c = QtyAmountState.find((k) => k.Cid == id);
    return c;
  };

  useMemo(() => {
    const qtyAmountData = QtyAmountState.filter((a) => a.amount > 0);

    let orderderArray = [];
    if (ServicesData.length > 0) {
      for (const i of ServicesData) {
        for (const j of qtyAmountData) {
          if (i._id === j.Cid) {
            orderderArray.push({
              itemName: i.item,
              qty: j.qty,
              _id: i._id,
              total: j.qty * j.amount,
              type: typeService,
              amount: j.amount,
            });
          }
        }
      }
    }

    console.log(orderderArray);
    handleservice(orderderArray);
    // return orderderArray;
  }, [QtyAmountState, checkBoxes]);

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        onClick={handleClickOpen}
        color="primary"
      >
        NEW ORDER
      </Button>

      <CustomDialog
        title={<div>New Order</div>}
        onClose={handleClose}
        open={open}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "md",
        }}
      >
        <div>
          <FormControl
            control="radio"
            onChange={(e) => onChangeTypeService(e, QtyAmountState)}
            items={serviceItems}
          />
          <BaseTable
            header={Header}
            items={
              ServicesData.length === 0
                ? []
                : ServicesData.map((row) => {
                    const data = { ...row };

                    let checkData = getcheckState(row._id);

                    data.check = (
                      <Checkbox
                        checked={checkData ? checkData.ischeck : false}
                        onChange={(e) => handleChangeCheck(e, row._id, data)}
                      />
                    );

                    let qtyAmount = getQtyAmountState(row._id);
                    data.qty = (
                      <TextField
                        type="number"
                        className={classes.field}
                        size="small"
                        name="qty"
                        variant="outlined"
                        value={qtyAmount ? qtyAmount.qty : 1}
                        onChange={(e) => handleQtyAmountState(e, row._id, data)}
                      />
                    );

                    data.price = (
                      <TextField
                        type="number"
                        className={classes.field}
                        size="small"
                        name="amount"
                        value={qtyAmount ? qtyAmount.amount : 0}
                        onChange={(e) => handleQtyAmountState(e, row._id, data)}
                        variant="outlined"
                      />
                    );

                    let getColor = getColorState(row._id);
                    data.color = (
                      <div>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleModalColor(row._id)}
                          color="primary"
                        >
                          Color
                        </Button>
                        <CustomDialog
                          title={<div>Choose Color</div>}
                          onClose={handleModalColor}
                          open={openColor}
                          dialogProp={{
                            disableBackdropClick: true,
                            scroll: "body",
                            maxWidth: "md",
                          }}
                        >
                          <Grid container>
                            <Box>
                              <Grid item xs={4}>
                                <SketchPicker
                                  color={getColor ? getColor.color : "#FFF"}
                                  onChangeComplete={(c) =>
                                    handleComplateColor(c, row)
                                  }
                                />
                              </Grid>
                            </Box>
                            <Box>
                              <Grid item xs={8}>
                                <List dense={false}>
                                  {getColor
                                    ? getColor.colors.map((c) => (
                                        <Button onClick={() => 1}>
                                          <Brightness1Icon
                                            style={{
                                              color: c,
                                              boxShadow:
                                                "0px 8px 15px rgba(0, 0, 0, 0.4)",
                                            }}
                                          />
                                        </Button>
                                      ))
                                    : []}
                                </List>
                              </Grid>
                            </Box>
                          </Grid>
                        </CustomDialog>
                      </div>
                    );

                    return data;
                  })
            }
          />
        </div>
      </CustomDialog>
    </div>
  );
}
