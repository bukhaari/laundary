import { memo, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Icon, Box } from "@material-ui/core";
import BaseInput from "../../components/controls/BaseInput";
import { useRules } from "../../Hooks/useRueles";
import {
  addNewService,
  loadServices,
  getAllService,
} from "../../store/modules/service";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import BaseButton from "../../components/controls/BaseButton";
import { BaseCard } from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    marginTop: theme.spacing(4),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const breakPoin = { xs: 12, sm: 6 };

function NewCompany() {
  const disptch = useDispatch();
  const services = useSelector(getAllService);
  const classes = useStyles();
  console.log(services);

  useEffect(() => {
    disptch(loadServices());
  }, []);

  let [errMsg, setErrorMsg] = useState("");

  const isRequired = (v) => {
    return !!v || "is Required";
  };

  const { bindProps, data } = useRules({
    data: {
      item: "",
      domain: "riyoclean.com",
      washing: 0,
      ironing: 0,
      ExWashing: 0,
      ExIroning: 0,
    },
  });

  let [loading, setLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);
      disptch(addNewService(data.values))
        .then((v) => {
          data.clear();
        })
        .catch((err) => {
          // console.log("onError called");
          console.log(err.message);
          // let msg = err.message
          // if(typeof msg === "object")
          // msg =
          setErrorMsg(err.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Container component="main" className={classes.container} maxWidth="md">
      <BaseCard>
        <div className={classes.pageContent}>
          <CssBaseline />
          <Avatar className={classes.avatar}>
            <Icon>store</Icon>
          </Avatar>
          <Typography component="h1" variant="h5">
            REGISTER NEW SERVICE
          </Typography>
          <form onSubmit={formSubmit} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item sm={12} xs={12}>
                <BaseInput
                  {...bindProps("item")}
                  rules={[isRequired]}
                  deps={[errMsg]}
                  variant="outlined"
                  required
                  fullWidth
                  label="Item"
                  autoFocus
                />
              </Grid>
              <Grid item {...breakPoin}>
                <BaseInput
                  {...bindProps("washing")}
                  rules={[isRequired]}
                  variant="outlined"
                  required
                  fullWidth
                  type="number"
                  label="Washing"
                />
              </Grid>
              <Grid item {...breakPoin}>
                <BaseInput
                  {...bindProps("ironing")}
                  rules={[isRequired]}
                  deps={[errMsg]}
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                  label="Ironing"
                />
              </Grid>
              <Grid item {...breakPoin}>
                <BaseInput
                  {...bindProps("ExWashing")}
                  rules={[isRequired]}
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                  label="ExWashing"
                />
              </Grid>
              <Grid item {...breakPoin}>
                <BaseInput
                  {...bindProps("ExIroning")}
                  rules={[isRequired]}
                  variant="outlined"
                  required
                  type="number"
                  fullWidth
                  label="ExIroning"
                />
              </Grid>
            </Grid>
            <BaseButton
              loading={loading}
              label="create"
              className={classes.submit}
            />
          </form>
          <Grid container justify="center">
            <Grid item>
              <Box>
                <Typography color="error" component="h1" variant="subtitle2">
                  {errMsg && JSON.stringify(errMsg)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
      </BaseCard>
    </Container>
  );
}

export default memo(NewCompany);
// export default NewCompany;
