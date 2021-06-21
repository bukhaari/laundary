import { memo } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Icon, Box } from "@material-ui/core";
import BaseInput from "../components/controls/BaseInput";
import { useRules } from "../Hooks/useRueles";
import { newBussiness } from "../store/modules/newBusines";
import { useDispatch } from "react-redux";
import { useState } from "react";
import BaseButton from "../components/controls/BaseButton";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "grey",
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

function NewCompany() {
  const classes = useStyles();

  let company = {
    compName: "ABAS LAUNDRY",
    domain: "riyoclean.com",
    // compColor:'#ffa726',
    // compTextColor:'black',
    // branColor:'#0D142B',
    // branTextColor:'#ffa726',
    branch: "RIYO",
    brnchPhone: "0705643583",
    country: "kenya",
    city: "Nairobi",
    compPhone: "0705643795",
    manager: "ABDULLAHI ABAS",
    UserName: "ABAS",
    password: "112233",
  };
  let [errMsg, setErrorMsg] = useState("");
  // useEffect(() => {
  //   console.log(getters);
  // }, [getters]);

  const isRequired = (v) => {
    return !!v || "is Required";
  };

  function isExist(v, field) {
    // console.log("outer", errMsg);
    // console.log(errMsg["UserName"]);
    if (typeof errMsg !== "object") return false;
    return v !== errMsg[field] || `${v} is already registered`;
  }

  const { bindProps, data } = useRules({
    data: company,
  });

  const dispatch = useDispatch();

  let [loading, setLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);
      dispatch(newBussiness(data.values))
        .then((v) => {
          console.log(v);
          data.clear();
        })
        .catch((err) => {
          // console.log("onError called");
          // console.log(err);
          // let msg = err.message
          // if(typeof msg === "object")
          // msg =
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
        <Avatar className={classes.avatar}>
          <Icon>store</Icon>
        </Avatar>
        <Typography component="h1" variant="h5">
          REGISTER NEW LAUNDRY
        </Typography>
        <form onSubmit={formSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <BaseInput
                {...bindProps("compName")}
                rules={[isRequired, isExist]}
                deps={[errMsg]}
                variant="outlined"
                required
                fullWidth
                label="Company Name"
                autoFocus
              />
            </Grid>{" "}
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("manager")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="Manager"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("compPhone")}
                rules={[isRequired, isExist]}
                deps={[errMsg]}
                variant="outlined"
                required
                fullWidth
                label="Comp Phone"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("branch")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="Branch Name"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("brnchPhone")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="Branch Phone"
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
              <BaseInput
                {...bindProps("UserName")}
                rules={[isRequired, isExist]}
                deps={[errMsg]}
                variant="outlined"
                required
                fullWidth
                label="User Name"
              />
            </Grid>
            <Grid item {...breakPoin}>
              <BaseInput
                {...bindProps("password")}
                rules={[isRequired]}
                variant="outlined"
                required
                fullWidth
                label="Password"
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

export default memo(NewCompany);
// export default NewCompany;
