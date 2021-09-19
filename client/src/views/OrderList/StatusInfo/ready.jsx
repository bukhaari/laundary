import * as Yup from "yup";
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateReady } from "../../../store/modules/Order";
import BaseFormik from "../../../components/common/BaseFormik";
import FormikControl from "../../../components/controls/FormControl";
import Notification from "../../../components/common/Notification";

function Ready({ orderId, OrderList, setOrderList }) {
  const dispatch = useDispatch();

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleUpdateOrder = (shelf) => {
    let current = OrderList.find((item) => item._id === orderId);
    current.status = "Ready";
    current.shelf = shelf;
    setOrderList((prev) => [...prev]);
  };

  const onSubmit = async (values) => {
    const data = {
      ...values,
      orderId: orderId,
    };
    console.log(data);
    setNotify({
      isOpen: true,
      message: ` Successfully to update status`,
      type: "success",
    });
    handleUpdateOrder(values.shelf);
    await dispatch(updateReady(data));
  };

  const validationSchema = Yup.object({
    shelf: Yup.string().required("Required!"),
  });

  const initialValues = {
    shelf: "",
  };

  return (
    <BaseFormik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormikControl
            control="field"
            type="number"
            name="shelf"
            lable="Shelf"
          />
        </Grid>
        <Grid item xs={12}>
          <FormikControl control="Button" />
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </BaseFormik>
  );
}

export default Ready;
