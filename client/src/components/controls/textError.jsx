import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  error: {
    color: "red",
    marginLeft: "8px",
  },
});

function TextError({ children }) {
  const classes = useStyles();
  return <div className={classes.error}>{children}</div>;
}

export default TextError;
