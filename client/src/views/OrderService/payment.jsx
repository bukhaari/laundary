import { FormikStep } from "../../components/common/Stepper";
import FormikControl from "../../components/controls/FormControl";
import {
  Grid,
  Card,
  CardContent,
  makeStyles,
  CardHeader,
  TextField,
} from "@material-ui/core";

function Payment({ info, checking, totalAmount }) {
  const { name } = info;
  const description = checking + " " + name;
  const TypePaid = [
    { label: "Cash", value: "Cash" },
    { label: "M-PESA", value: "M-PESA" },
  ];

  const useStyle = makeStyles({
    desClor: {
      color: checking === "" ? "black" : "red",
    },
  });

  const classes = useStyle();

  return (
    <FormikStep>
      <Card>
        <CardHeader title={description} className={classes.desClor} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormikControl
                control="field"
                name="paidAmount"
                type="number"
                lable="Paid Amount"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                type="number"
                fullWidth
                disabled
                label="balance"
                size="small"
                variant="outlined"
                value={totalAmount}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormikControl
                control="radioFieldGroup"
                name="typePaid"
                items={TypePaid}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormikStep>
  );
}

export default Payment;
