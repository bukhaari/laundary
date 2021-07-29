import React, { useEffect, useMemo, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useSelector, useDispatch } from "react-redux";
import { getAllService, loadServices } from "../../store/modules/service";
import FormControl from "../../components/controls/FormControl";
import BaseTable from "../../components/controls/BaseTable";
import {
  Container,
  TextField,
  Checkbox,
  makeStyles,
  Button,
} from "@material-ui/core";
import CustomDialog from "../../components/CustomDialog";

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

export default function NewOrder({ handleservice }) {
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

  useEffect(async () => {
    await dispatch(loadServices());
  }, []);

  const serviceItems = [
    { value: "washing", label: "Washing" },
    { value: "ironing", label: "Ironing" },
    { value: "ExWashing", label: "Ex-Washing" },
    { value: "ExIroning", label: "Ex-Ironing" },
  ];

  const getCheckState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        ischeck: false,
      };
    });

  const getQtyAmountState = async () =>
    await ServicesData.map((s) => {
      return {
        Cid: s._id,
        amount: 0,
        qty: 1,
      };
    });

  const [checkBoxes, seCheck] = useState([]);
  const [QtyAmountState, setQtyAmountState] = useState([]);
  useEffect(() => {
    const handleValues = async () => {
      const checkboxState = await getCheckState();
      const qtyAmountNewSatet = await getQtyAmountState();
      setQtyAmountState(qtyAmountNewSatet);
      seCheck(checkboxState);
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

  const getcheck = (id) => {
    let c = checkBoxes.find((k) => k.Cid == id);
    return c;
  };

  const getQtyAmount = (id) => {
    let c = QtyAmountState.find((k) => k.Cid == id);
    return c;
  };

  const orderValues = useMemo(() => {
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
              type: typeService,
              amount: j.amount,
            });
          }
        }
      }
    }

    return orderderArray;
  }, [QtyAmountState, checkBoxes]);

  const handleOrder = () => {
    handleservice(orderValues);
  };

  console.log(ServicesData);

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
        <Container>
          <CssBaseline />
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

                      let checkData = getcheck(row._id);

                      data.check = (
                        <Checkbox
                          checked={checkData ? checkData.ischeck : false}
                          onChange={(e) => handleChangeCheck(e, row._id, data)}
                        />
                      );

                      let qtyAmount = getQtyAmount(row._id);
                      data.qty = (
                        <TextField
                          type="number"
                          className={classes.field}
                          size="small"
                          name="qty"
                          variant="outlined"
                          value={qtyAmount ? qtyAmount.qty : 1}
                          onChange={(e) =>
                            handleQtyAmountState(e, row._id, data)
                          }
                        />
                      );

                      data.price = (
                        <TextField
                          type="number"
                          className={classes.field}
                          size="small"
                          name="amount"
                          value={qtyAmount ? qtyAmount.amount : 0}
                          onChange={(e) =>
                            handleQtyAmountState(e, row._id, data)
                          }
                          variant="outlined"
                        />
                      );

                      data.color = (
                        <Button className={classes.field} size="small">
                          Color
                        </Button>
                      );

                      return data;
                    })
              }
            />

            <Button
              variant="contained"
              size="small"
              className={classes.order}
              disabled={orderValues.length === 0 ? true : false}
              onClick={() => {
                handleOrder();
                handleClose();
              }}
              color="primary"
            >
              ORDER
            </Button>
          </div>
        </Container>
      </CustomDialog>
    </div>
  );
}
