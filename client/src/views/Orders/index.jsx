import { memo } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Typography,
  colors,
} from "@material-ui/core";
import { useRules } from "../../Hooks/useRueles";
import { useState } from "react";
import BaseInput from "../../components/controls/BaseInput";
import BaseButton from "../../components/controls/BaseButton";
// import BaseSelect from "../../components/controls/BaseSelect";
// import SearchIcon from "@material-ui/icons/Search";
import {
  BaseCard,
  CardHeader,
  CardBody,
} from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(7),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },

  button: {
    padding: "opx 2px",
    background: "#0b8457",
    float:"right"
  },

  TableCell: {
    borderBottom: "0px solid",
  },
  CardHeader: {
    borderBottom: "2px solid #dee1ec",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[100],
    padding:theme.spacing(1.5)
  },
}));

function Order() {
  const classes = useStyles();

  const [CartService] = useState([
    { id: 1, service: "washing", item: "SHIRTS", qty: 1, price: 70 },
    { id: 2, service: "Ironing", item: "TROUSER", qty: 4, price: 60 },
    { id: 3, service: "washing", item: "T-SHIRT", qty: 3, price: 40 },
  ]);
  const NewPaid = { phone: "", name: "", paid: "", balnce: "" };


  const { bindProps } = useRules({
    data: NewPaid,
  });

  // console.log("rerendered");
  // location.push("/");
  // console.log(location);
  return (
    <div className={classes.pageContent}>
      <CssBaseline />
      <Grid container spacing={3}>
        {/* service Form */}
        <Grid item md={6}>
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
        </Grid>

        {/* Payment Form */}
        <Grid item md={6}>
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
        </Grid>

        {/* Table of Data */}
        <Grid item md={12}>
          <BaseCard>
            <Grid container spacing={3}>
              <Grid item md={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>QTY</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {CartService.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className={classes.TableCell}>
                          {c.item}
                        </TableCell>
                        <TableCell className={classes.TableCell}>
                          {c.service}
                        </TableCell>
                        <TableCell className={classes.TableCell}>
                          {c.qty}
                        </TableCell>
                        <TableCell className={classes.TableCell}>
                          {c.price}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid
                item
                md={12}
                style={{
                  textAlign: "right",
                  marginRight: "50px",
                }}
              >
                <Typography style={{ fontWeight: "bold" }}>
                  Total Amount: 150
                </Typography>
              </Grid>
            </Grid>
          </BaseCard>
        </Grid>
      </Grid>
    </div>
  );
}

export default memo(Order);
