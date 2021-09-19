import * as Yup from "yup";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import BaseFormik from "../../../components/common/BaseFormik";
import { updatePayment } from "../../../store/modules/payment";
import FormikControl from "../../../components/controls/FormControl";
import Notification from "../../../components/common/Notification";

function Payment({ orderId, setpidBalance, balance }) {
  const dispatch = useDispatch();

  const [TypePaid, setTypePaid] = useState("Cash");
  const [CurrentPaid, setCurrentPaid] = useState({
    Cash: true,
    MPESA: false,
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [checker, setChecker] = useState(0);

  const handleChangeType = (e) => {
    setTypePaid(e.target.value);
    setCurrentPaid({
      Cash: false,
      MPESA: false,
    });
    setCurrentPaid((prev) => {
      return { ...prev, [e.target.value]: true };
    });
  };

  const TypeItems = [
    { value: "Cash", label: "Cash", current: CurrentPaid.Cash },
    { value: "MPESA", label: "M-PESA", current: CurrentPaid.MPESA },
  ];

  const onSubmit = async (values, helpers) => {
    const data = {
      ...values,
      typePaid: TypePaid,
      orderId: orderId,
    };
    setpidBalance((prev) => prev + values.paidAmount);
    setChecker(values.paidAmount);
    setNotify({
      isOpen: true,
      message: ` Successfully to payment`,
      type: "success",
    });
    // handleModalStatus();
    console.log(data);
    helpers.resetForm();
    setTypePaid("Cash");
    setCurrentPaid({
      Cash: true,
      MPESA: false,
    });
    await dispatch(updatePayment(data));
  };

  const validationSchema = Yup.object({
    paidAmount: Yup.number()
      .min(1, "Please pay more than 0 ")
      .required("Required!"),
    discount: Yup.string().required("Required!"),
  });

  const initialValues = {
    paidAmount: 0,
    discount: 0,
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
            name="paidAmount"
            lable="Amount"
          />
        </Grid>
        <Grid item xs={12}>
          <FormikControl
            control="field"
            type="number"
            name="discount"
            lable="Discount"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormikControl
            control="radio"
            onChange={handleChangeType}
            items={TypeItems}
          />
        </Grid>
        <Grid item xs={12}>
          <FormikControl
            control="Button"
            disabled={checker === balance ? true : balance === 0 ? true : false}
          />
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </BaseFormik>
  );
}

export default Payment;
