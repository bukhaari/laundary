import { FormikStep } from "../../components/common/Stepper";
import FormikControl from "../../components/controls/FormControl";
import { Grid, Card, CardContent, CardHeader } from "@material-ui/core";

function Payment({ personal }) {
  const { name } = personal;
  const TypePaid = [
    { label: "Cash", value: "Cash" },
    { label: "M-PESA", value: "M-PESA" },
  ];

  return (
    <FormikStep>
      <Card>
        <CardHeader title={name} />
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
              <FormikControl
                control="field"
                type="number"
                name="balance"
                lable="Balance"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormikControl
                control="checkbox"
                options={TypePaid}
                name="typePaid"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormikStep>
  );
}

export default Payment;
