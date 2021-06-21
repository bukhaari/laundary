import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Icon, Grid, Container, Box } from "@material-ui/core";
import { useRules } from "../../../Hooks/useRueles";
import { useDispatch } from "react-redux";
import BaseInput from "../../../components/controls/BaseInput";
import { updateBrunch } from "../../../store/modules/Branch";
import BaseButton from "../../../components/controls/BaseButton";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgoundColor: "blue",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    // color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, branch, ...other } = props;
  return (
    <MuiDialogTitle
      style={{ backgroundColor: branch.appParColor, color: branch.textColor }}
      disableTypography
      className={classes.root}
      {...other}
    >
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          color="inherit"
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function EditeBranch({ branch }) {
  let defaultObj = {
    _id: branch._id,
    BranchName: branch.BranchName,
    phone: branch.phone,
    appParColor: branch.appParColor,
    sideColor: branch.sideColor,
    textColor: branch.textColor,
  };
  const [open, setOpen] = useState(false);
  let [errMsg, setErrorMsg] = useState("");

  const { bindProps, data } = useRules({
    data: defaultObj,
  });

  const isRequired = (v) => {
    return !!v || "is Required";
  };
  let [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onBranchSave = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);
      dispatch(updateBrunch(data.values))
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} color="inherit">
        <Icon>mode</Icon>
      </IconButton>

      <Dialog
        disableBackdropClick
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          branch={{ ...branch, ...data.values }}
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {branch.BranchName} Branch
        </DialogTitle>
        <DialogContent dividers>
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <BaseInput
                  {...bindProps("BranchName")}
                  rules={[isRequired]}
                  fullWidth
                  required
                  label="Branch Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <BaseInput
                  {...bindProps("phone")}
                  rules={[isRequired]}
                  fullWidth
                  required
                  label="Branch Phone"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <BaseInput
                  fullWidth
                  {...bindProps("appParColor")}
                  rules={[isRequired]}
                  required
                  label="Header Color"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <BaseInput
                  {...bindProps("sideColor")}
                  rules={[isRequired]}
                  fullWidth
                  required
                  label="Side Color"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <BaseInput
                  {...bindProps("textColor")}
                  rules={[isRequired]}
                  fullWidth
                  required
                  label="Text Color"
                  variant="outlined"
                />
              </Grid>
            </Grid>
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
        </DialogContent>
        <DialogActions>
          <BaseButton
            fullWidth={false}
            loading={loading}
            onClick={onBranchSave}
            label="Save Change"
            variant="outlined"
          ></BaseButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
