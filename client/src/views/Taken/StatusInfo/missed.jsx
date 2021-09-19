import * as Yup from "yup";
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { updateMissed } from "../../../store/modules/Order";
import BaseFormik from "../../../components/common/BaseFormik";
import FormikControl from "../../../components/controls/FormControl";
import Notification from "./../../../components/common/Notification";

function Missed({ orderId, OrderList, setOrderList }) {
  const dispatch = useDispatch();

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const handleFilterMissed = () => {
    let filterData = OrderList.filter((item) => item._id !== orderId);
    setOrderList((prev) => [...filterData]);
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
    handleFilterMissed();
    await dispatch(updateMissed(data));
  };

  const validationSchema = Yup.object({
    note: Yup.string().required("Required!"),
  });

  const initialValues = {
    note: "",
  };

  return (
    <BaseFormik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormikControl control="field" name="note" lable="Missing Note" />
        </Grid>
        <Grid item xs={12}>
          <FormikControl control="Button" />
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </BaseFormik>
  );
}

export default Missed;
