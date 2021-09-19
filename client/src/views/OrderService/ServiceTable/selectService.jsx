import Color from "./color";
import { useSelector, useDispatch } from "react-redux";
import CustomDialog from "../../../components/CustomDialog";
import React, { useEffect, useMemo, useState } from "react";
import BaseTable from "../../../components/controls/BaseTable";
import FormControl from "../../../components/controls/FormControl";
import { TextField, Checkbox, makeStyles, Button } from "@material-ui/core";
import { getAllService, loadServices } from "../../../store/modules/service";

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

export default function SelectServices(props) {
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

  useEffect(async () => {
    await dispatch(loadServices());
  }, []);

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
  const [CurrentService, setCurrentService] = useState({
    washing: true,
    ironing: false,
    ExWashing: false,
    ExIroning: false,
  });
  const serviceItems = [
    { value: "washing", label: "Washing", current: CurrentService.washing },
    { value: "ironing", label: "Ironing", current: CurrentService.ironing },
    {
      value: "ExWashing",
      label: "Ex-Washing",
      current: CurrentService.ExWashing,
    },
    {
      value: "ExIroning",
      label: "Ex-Ironing",
      current: CurrentService.ExIroning,
    },
  ];
  const onChangeTypeService = (e) => {
    //change service Type. radio Button onChange Here!.
    setTypeService(e.target.value);

    setCurrentService({
      washing: false,
      ExWashing: false,
      ironing: false,
      ExIroning: false,
    });
    setCurrentService((prev) => {
      return { ...prev, [e.target.value]: true };
    });
    // console.log("name", e.target.value);

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
      for (const s of ServicesData) {
        for (const q of qtyAmountData) {
          for (const c of ColorState) {
            if (s._id === q.Cid && s._id === c._id) {
              orderderArray.push({
                itemName: s.item,
                colors: c.colors,
                qty: q.qty,
                _id: s._id,
                type: typeService,
                amount: q.amount,
                total: q.qty * q.amount,
                date: new Date().toString(),
              });
            }
          }
        }
      }
    }

    handleservice(orderderArray);
    // return orderderArray;
  }, [QtyAmountState, checkBoxes, ColorState]);

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
                      <Color
                        setColorState={setColorState}
                        ColorState={ColorState}
                        row={row}
                        value={getColor}
                      />
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
