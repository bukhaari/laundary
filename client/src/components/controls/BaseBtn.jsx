import { Button, makeStyles } from "@material-ui/core";

function BaseBtn(props) {
  const {
    onClick,
    // parentclass,
    disabled,
    startIcon,
    hoverColor = "#3aa76d",
    width = "4rem",
    marginTop = "1rem",
    marginLeft,
    borderRadius = 0,
    backgroundColor = "#3aa76d",
    label = "Submit",
    color = "#fff",
    type = "submit",
    fontWeight,
  } = props;

  const useStyles = makeStyles({
    Button: {
      borderRadius,
      marginTop,
      marginLeft,
      backgroundColor,
      width,
      fontWeight,
      color,
      "&:hover": {
        backgroundColor: hoverColor,
      },
    },
  });

  const classes = useStyles();

  return (
    // <div className={parentclass}>
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={classes.Button}
      startIcon={startIcon}
    >
      {label}
    </Button>
    // </div>
  );
}

export default BaseBtn;
