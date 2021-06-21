import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Icon, colors } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: colors.grey[300],
  },

  paper: {
    margin: theme.spacing(15, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  page: {
    // backgroundSize: "cover",
    backgroundColor: "transparent",
    // height: "100vh",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    // height: 40,
  },
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <Grid
      container
      component="main"
      className={classes.root}
      alignContent="center"
    >
      <Grid
        item
        xs={12}
        className={classes.page}
        component={Paper}
        elevation={1}
      >
        <div className={classes.paper}>
          <Avatar size={60} className={classes.avatar}>
            <Icon>report_problem</Icon>
          </Avatar>
          <Typography component="h1" variant="h3">
            404
          </Typography>
          <Typography component="h1" variant="h5">
            Not Found page
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}
