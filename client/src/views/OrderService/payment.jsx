import { useEffect, useState } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";
import { FormikStep } from "../../components/common/Stepper";
import FormControl from "../../components/controls/FormControl";
import { makeStyles, TextField, Typography } from "@material-ui/core";

function Payment({ info, checking, payment, setPayment, setTypePaid }) {
  const useStyle = makeStyles({
    desClor: {
      color: checking === "" ? "black" : "red",
    },
  });
  const classes = useStyle();
  const { name, balance: oldBalance } = info;

  const handlePayment = (e) => {
    setPayment((prev) => {
      return { ...prev, [e.target.name]: parseInt(e.target.value) };
    });
  };
  const { balance, totalAmount, paidAmount } = payment;

  useEffect(() => {
    if (paidAmount)
      setPayment((prev) => {
        return {
          ...prev,
          balance:
            parseInt(oldBalance) + parseInt(totalAmount) - parseInt(paidAmount),
        };
      });

    if (!paidAmount)
      setPayment((prev) => {
        return {
          ...prev,
          balance: parseInt(oldBalance) + parseInt(totalAmount),
        };
      });
  }, [paidAmount]);

  const [CurrentPaid, setCurrentPaid] = useState({
    Cash: true,
    MPESA: false,
  });
  const TypeItems = [
    { value: "Cash", label: "Cash", current: CurrentPaid.Cash },
    { value: "MPESA", label: "M-PESA", current: CurrentPaid.MPESA },
  ];
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

  return (
    <FormikStep>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Typography className={classes.desClor}>
                {checking ? checking : ` Name:${name}`}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography>
                {checking
                  ? ""
                  : `Preivious Balance:
                ${oldBalance}
                and new balance:
                ${totalAmount}`}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                size="small"
                lable="Paid"
                type="number"
                variant="outlined"
                name="paidAmount"
                value={paidAmount}
                onChange={handlePayment}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                type="number"
                size="small"
                label="Preivious balance + new balance"
                variant="outlined"
                name="totalAmount"
                value={balance}
                onChange={handlePayment}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl
                control="radio"
                onChange={handleChangeType}
                items={TypeItems}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormikStep>
  );
}

export default Payment;
