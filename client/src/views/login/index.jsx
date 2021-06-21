import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { IconButton, Icon, Box } from "@material-ui/core";
import { useState } from "react";
import { useLoginStyles } from "./loginCss";
import BaseButton from "../../components/controls/BaseButton";
import { useRules } from "../../Hooks/useRueles";
import { loginCall, isAuthenticated, getLinks } from "../../store/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import BaseInput from "../../components/controls/BaseInput";
import { useHistory } from "react-router-dom";
import { memo } from "react";
import { useEffect } from "react";

function LoginPage() {
  const classes = useLoginStyles();
  const { bindProps, data } = useRules({
    data: { userName: "abas", password: "112233" },
  });
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  let [visible, setVisible] = useState(false);
  let [errMsg, setErrorMsg] = useState("");

  const onVisibleChange = () => {
    setVisible(!visible);
  };

  const isRequired = (v) => !!v || "Required";
  let history = useHistory();

  let Auth = useSelector(isAuthenticated);
  let [home] = useSelector(getLinks);

  useEffect(() => {
    if (Auth) history.replace(home.to, { from: "/login" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Auth]);

  const onLogin = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);
      dispatch(loginCall(data.values))
        .then((v) => {
          // console.log(v);
          // data.clear();
          // history.replace(v.data.User.links[0].to);
        })
        .catch((err) => {
          setErrorMsg(err.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={6} lg={8} className={classes.image} />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        className={classes.signinColor}
        component={Paper}
        elevation={0}
      >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={onLogin} className={classes.form} noValidate>
            <BaseInput
              {...bindProps("userName")}
              rules={[isRequired]}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="User Name"
            />
            <BaseInput
              {...bindProps("password")}
              rules={[isRequired]}
              variant="outlined"
              required
              fullWidth
              label="Password"
              type={visible ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={onVisibleChange}>
                    <Icon>{visible ? "visibility" : "visibility_off"}</Icon>
                  </IconButton>
                ),
              }}
            />

            <BaseButton
              loading={loading}
              label="Sign In"
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
      </Grid>
    </Grid>
  );
}

export default memo(LoginPage);
