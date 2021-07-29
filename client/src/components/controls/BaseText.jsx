import { Typography, makeStyles } from "@material-ui/core";

function BaseText(props) {
  const { label, align, variant, color, fontSize, fontWeight, parentclass } =
    props;

  const useStyles = makeStyles({
    textTitle: {
      color,
      fontSize,
      fontWeight,
    },
  });

  const classes = useStyles();

  return (
    <div className={parentclass}>
      <Typography align={align} variant={variant} className={classes.textTitle}>
        {label}
      </Typography>
    </div>
  );
}

export default BaseText;
