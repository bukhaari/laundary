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
  Button,
} from "@material-ui/core";
import CustomDialog from "../../../components/CustomDialog";
import { useDispatch } from "react-redux";
import BaseInput from "../../../components/controls/BaseInput";
import { useRules } from "../../../Hooks/useRueles";
import BaseButton from "../../../components/controls/BaseButton";

import { GROUP_REQUEST, USER_REQUEST } from "../../../store/modules/Users";

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

export default function AddUser({
  method = "post",
  editeUser = {},
  onFinish = () => null,
}) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrorMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { bindProps, data } = useRules({
    data: {
      _id: editeUser._id || "",
      FullName: editeUser.FullName || "",
      UserType: editeUser.UserType || "",
      Password: "",
      //   ...editeUser,
    },
  });

  //   console.log(editeUser);

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
  const [UserRole, setUserRoles] = React.useState([]);
  React.useEffect(() => {
    dispatch(GROUP_REQUEST())
      .then((val) => {
        setUserRoles(val.data);
      })
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveUser = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setLoading(true);
      setErrorMsg("");
      dispatch(USER_REQUEST(data.values, method))
        .then(() => {
          data.clear();
          if (typeof onFinish === "function") onFinish();
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
      {!editeUser._id ? (
        <Button
          variant="contained"
          size="small"
          onClick={handleClickOpen}
          color="primary"
        >
          NEW USER
        </Button>
      ) : (
        <IconButton
          size={!!editeUser._id ? "small" : "medium"}
          onClick={handleClickOpen}
        >
          <Icon style={{ color: "black" }} color="inherit">
            {!!editeUser._id ? "edit" : "add_box"}
          </Icon>
        </IconButton>
      )}
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
              <Icon>account_circle</Icon>
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              style={{
                padding: "0.5rem",
                textAlign: "center",
              }}
            >
              {editeUser._id
                ? `EDIT USER ${editeUser._id}`
                : `REGISTER NEW USER`}
            </Typography>
            <form onSubmit={onSaveUser} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("FullName")}
                    rules={[Required]}
                    variant="outlined"
                    required
                    fullWidth
                    label="FULL NAME"
                    autoFocus
                  />
                </Grid>

                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("UserType")}
                    rules={[Required]}
                    variant="outlined"
                    items={UserRole}
                    itemText="GroupName"
                    itemValue="GroupName"
                    fullWidth
                    label="USER TYPE"
                    select
                  />
                </Grid>
                {!!!editeUser._id && (
                  <>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("_id")}
                        rules={[Required]}
                        variant="outlined"
                        required
                        fullWidth
                        label="USER NAME"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("Password")}
                        rules={[Required]}
                        variant="outlined"
                        required
                        fullWidth
                        label="PASSWORD"
                      />
                    </Grid>
                  </>
                )}
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
