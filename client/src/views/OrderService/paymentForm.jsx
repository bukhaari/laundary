import { memo } from "react";
import { useRules } from "../../Hooks/useRueles";
import BaseInput from "../../components/controls/BaseInput";
import BaseButton from "../../components/controls/BaseButton";
import { BaseCard, CardBody } from "../../components/common/BaseCard";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  colors,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  CardHeader: {
    borderBottom: "2px solid #dee1ec",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[100],
    padding: theme.spacing(1.5),
  },
}));

function PaymentForm() {
  const classes = useStyles();

  const NewPaid = { phone: "", name: "", paid: "", balnce: "" };
  const { bindProps } = useRules({
    data: NewPaid,
  });

  return (
    <BaseCard>
      <div className={classes.CardHeader}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Typography>Amount</Typography>
          </Grid>
        </Grid>
      </div>
      <CardBody>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6}>
            <BaseInput
              {...bindProps("phone")}
              // rules={[isRequired]}
              variant="outlined"
              required
              fullWidth
              label="Customer Phone"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <BaseInput
              {...bindProps("name")}
              // rules={[isRequired]}
              variant="outlined"
              required
              fullWidth
              label="Full Name"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <BaseInput
              {...bindProps("paid")}
              // rules={[isRequired]}
              variant="outlined"
              required
              type="number"
              fullWidth
              label="Paid Amount"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <BaseInput
              {...bindProps("balnce")}
              // rules={[isRequired]}
              variant="outlined"
              required
              type="number"
              fullWidth
              label="Balnce"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <FormControl>
              <RadioGroup row>
                <FormControlLabel
                  value="Cash"
                  control={<Radio />}
                  label="Cash"
                />
                <FormControlLabel
                  value="M-PESA"
                  control={<Radio />}
                  label="M-PESA"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6}>
            <BaseButton label="Add New" />
          </Grid>
        </Grid>
      </CardBody>
    </BaseCard>
  );
}

export default memo(PaymentForm);
