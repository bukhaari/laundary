import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  IconButton,
  Icon,
  Container,
  Grid,
  Typography,
  Box,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch } from "react-redux";
import BaseInput from "../../../components/controls/BaseInput";
import { useRules } from "../../../Hooks/useRueles";
import BaseButton from "../../../components/controls/BaseButton";

import { PASS_RESET } from "../../../store/modules/Users";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
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

export default function PassReset({ UserName = "", editeUser = {} }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { bindProps, data } = useRules({
    data: {
      _id: UserName,
      Password: "",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const Required = (v) => {
    if (!v) return "this field is required";
    return true;
  };

  let dispatch = useDispatch();

  const onResetPass = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setLoading(true);
      setErrorMsg("");
      dispatch(PASS_RESET(data.values))
        .then(() => {
          data.clear();
          setLoading(false);
          // console.log(result);
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg(err.message);
          setLoading(false);
        });
    }
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  const breakPoin = { xs: 12 };

  return (
    <div>
      <IconButton
        size={!!UserName ? "small" : "medium"}
        onClick={handleClickOpen}
      >
        <Icon style={{ color: "black" }} color="inherit">
          password
        </Icon>
      </IconButton>
      <CustomDialog
        onClose={handleClose}
        open={open}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "md",
        }}
      >
        <Container maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <Icon>vpn_key</Icon>
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              style={{
                padding: "0.5rem",
                textAlign: "center",
              }}
            >
              {`RESET PASSWORD USER NAME (${UserName})`}
            </Typography>
            <form onSubmit={onResetPass} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("Password")}
                    rules={[Required]}
                    variant="outlined"
                    required
                    fullWidth
                    label="NEW PASSWORD"
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
        </Container>
        <Grid container justify="center">
          <Grid item>
            <Box>
              <Typography color="error" component="h1" variant="subtitle2">
                {errMsg}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CustomDialog>
    </div>
  );
}
