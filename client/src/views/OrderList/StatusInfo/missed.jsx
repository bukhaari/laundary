import * as Yup from "yup";
import React from "react";
import { Grid } from "@material-ui/core";
import BaseFormik from "../../../components/common/BaseFormik";
import FormikControl from "../../../components/controls/FormControl";

function Missed() {
  const onSubmit = (values) => {
    console.log(values);
  };

  const validationSchema = Yup.object({
    note: Yup.string().required("Required!"),
  });

  const initialValues = {
    status: "missed",
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
    </BaseFormik>
  );
}

export default Missed;