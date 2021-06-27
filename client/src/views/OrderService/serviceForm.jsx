import React from "react";
import { BaseCard, CardBody } from "../../components/common/BaseCard";
import BaseButton from "../../components/controls/BaseButton";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  Typography,
  colors,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "opx 2px",
    background: "#0b8457",
    float: "right",
  },

  CardHeader: {
    borderBottom: "2px solid #dee1ec",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[100],
    padding: theme.spacing(1.5),
  },
}));

function ServiceForm() {
  const classes = useStyles();

  return (
    <BaseCard>
      <div className={classes.CardHeader}>
        <Grid container spacing={2}>
          <Grid item xs={9} sm={9}>
            <Typography>Service</Typography>
          </Grid>
          <Grid item xs={3} sm={3}>
            <BaseButton
              size="small"
              label="Add New"
              className={classes.button}
              component="button"
            />
          </Grid>
        </Grid>
      </div>
      <CardBody>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <FormControl>
              <FormLabel>Type Task</FormLabel>
              <RadioGroup row name="taskType">
                <FormControlLabel
                  value="Washing"
                  control={<Radio />}
                  label="Washing"
                />
                <FormControlLabel
                  value="Ironing"
                  control={<Radio />}
                  label="Ironing"
                />
                <FormControlLabel
                  value="Ex-Washing"
                  control={<Radio />}
                  label="Ex-Washing"
                />
                <FormControlLabel
                  value="Ex-Ironing"
                  control={<Radio />}
                  label="Ex-Ironing"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormLabel>Select service</FormLabel>
            <Select size="small" fullWidth></Select>
          </Grid>
        </Grid>
      </CardBody>
    </BaseCard>
  );
}

export default ServiceForm;
