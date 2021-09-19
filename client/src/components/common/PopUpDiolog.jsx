import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    position: "absolute",
    top: theme.spacing(5),
  },

  textTitele: {
    fontWeight: "600",
    fontSize: "19px",
    // paddingTop: theme.spacing(1),
  },

  secondary: {
    fontSize: "15px",
    fontWeight: "1000",
    paddingBottom: theme.spacing(1),
    float: "right",
    // marginLeft:theme.spacing(5)
  },
}));

function Popup(porps) {
  const classes = useStyles();
  const { title = "information", OpenPopUp, setOpenPopUp, children } = porps;
  return (
    <Dialog
      open={OpenPopUp}
      maxWidth="md"
      classes={{ paper: classes.dialogWrapper }}
    >
      <DialogTitle style={{ height: "55px" }}>
        <Grid container>
          <Grid item xs={10} sm={10}>
            <Typography className={classes.textTitele}>{title}</Typography>
          </Grid>
          <Grid item xs={2} sm={2}>
            <Button
              onClick={() => setOpenPopUp(false)}
              className={classes.secondary}
            >
              X
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}

export default Popup;
