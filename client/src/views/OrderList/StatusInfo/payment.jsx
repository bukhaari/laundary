import * as Yup from "yup";
import React from "react";
import { Grid } from "@material-ui/core";
import BaseFormik from "../../../components/common/BaseFormik";
import FormikControl from "../../../components/controls/FormControl";

function Payment() {
  const onSubmit = (values) => {
    console.log(values);
  };

  const validationSchema = Yup.object({
    amount: Yup.string().required("Required!"),
    discount: Yup.string().required("Required!"),
  });

  const initialValues = {
    amount: "",
    discount: "",
  };

  return (
    <BaseFormik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormikControl control="field" name="amount" lable="Amount" />
        </Grid>
        <Grid item xs={12}>
          <FormikControl control="field" name="discount" lable="Discount" />
        </Grid>
        <Grid item xs={12}>
          <FormikControl control="Button" />
        </Grid>
      </Grid>
    </BaseFormik>
  );
}

export default Payment;
