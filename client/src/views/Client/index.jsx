import { memo } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Icon, Box } from "@material-ui/core";
import { useRules } from "../../Hooks/useRueles";
import { useDispatch } from "react-redux";
import { useState } from "react";
import BaseInput from "../../components/controls/BaseInput";
import BaseButton from "../../components/controls/BaseButton";
import { addNewBranch } from "../../store/modules/Branch";
import BaseSelect from "../../components/controls/BaseSelect";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "black",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const breakPoin = { xs: 12, sm: 6 };

const countries = [
  { value: "kenya", text: "Kenya" },
  { value: "somalia", text: "Somalia" },
];
const Cashes = [
  {
    CashCode: "KES",
    CashName: "Kenya Shillings",
    CashSypol: "Ksh",
  },
  {
    CashCode: "USD",
    CashName: "United States Dollar",
    CashSypol: "$",
  },
];

function NewBranch() {
  const classes = useStyles();

  let newBranch = {
    BranchName: "",
    phone: "",
    appParColor: "#0D142B",
    sideColor: "#0D142B",
    textColor: "#ffa726",
    CashBase: "KES",
    branchCash: [],
    country: "kenya",
    city: "Nairobi",
  };
  let [errMsg, setErrorMsg] = useState("");
  const isRequired = (v) => {
    return !!v || "is Required";
  };
  const isArraySelect = (v) => {
    // console.log(v);
    return !!(v && !!v.length) || "is Required";
  };

  function isExist(v, field) {
    if (typeof errMsg !== "object") return false;
    return v !== errMsg[field] || `${v} is already registered`;
  }

  const { bindProps, data } = useRules({
    data: newBranch,
  });

  const dispatch = useDispatch();

  let [loading, setLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);

      dispatch(addNewBranch(data.values))
        .then((v) => {
          console.log(v);
          data.clear();
        })
        .catch((err) => {
          setErrorMsg(err.message);
        })
        .finally(() => setLoading(false));
    }
  };
  // console.log("rerendered");
  // location.push("/");
  // console.log(location);
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <form onSubmit={formSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("BranchName")}
                rules={[isRequired, isExist]}
                deps={[errMsg]}
                variant="outlined"
                required
                fullWidth
                label="BRANCH NAME"
                autoFocus
              />
            </Grid>{" "}
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("phone")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="PHONE"
              />
            </Grid>
            <Grid item {...breakPoin} md={4}>
              <BaseInput
                {...bindProps("appParColor")}
                rules={[isRequired, isExist]}
                deps={[errMsg]}
                variant="outlined"
                required
                fullWidth
                label="HEAD COLOR"
              />
            </Grid>
            <Grid item {...breakPoin} md={4}>
              <BaseInput
                {...bindProps("sideColor")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="SIDE COLOR"
              />
            </Grid>
            <Grid item {...breakPoin} md={4}>
              <BaseInput
                {...bindProps("textColor")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="TEXT COLOR"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("country")}
                rules={[isRequired]}
                variant="outlined"
                items={countries}
                fullWidth
                label="Company Name"
                select
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("city")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="City"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseSelect
                label="Cash Uses"
                {...bindProps("branchCash")}
                rules={[isArraySelect]}
                multiple
                returnObj
                items={Cashes}
                itemText="CashCode"
                itemValue="CashCode"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseSelect
                label="Cash Uses"
                {...bindProps("CashBase")}
                rules={[isRequired]}
                items={Cashes}
                itemText="CashCode"
                itemValue="CashCode"
              />
            </Grid>
          </Grid>
          <BaseButton
            loading={loading}
            label="create"
            className={classes.submit}
          />
        </form>
      </div>
      <Grid container justify="center">
        <Grid item>
          <Box>
            <Typography color="error" component="h1" variant="subtitle2">
              {errMsg && JSON.stringify(errMsg)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default memo(NewBranch);
