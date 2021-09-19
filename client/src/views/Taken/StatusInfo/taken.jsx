import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateTaken } from "../../../store/modules/Order";
import FormikControl from "../../../components/controls/FormControl";
import Notification from "../../../components/common/Notification";

function Taken({ orderId, OrderList, setOrderList }) {
  const dispatch = useDispatch();

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleUpdateOrder = () => {
    let current = OrderList.find((item) => item._id === orderId);
    current.status = "Taken";
    setOrderList((prev) => [...prev]);
  };

  const handleOnclick = async () => {
    const data = {
      orderId: orderId,
    };
    console.log(data);
    setNotify({
      isOpen: true,
      message: ` Successfully to update status`,
      type: "success",
    });
    await dispatch(updateTaken(data));
    handleUpdateOrder();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormikControl
          onClick={handleOnclick}
          label=" Submit taken"
          width="13rem"
          control="Button"
        />
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </Grid>
  );
}

export default Taken;
