import React from "react";
import { colors, Card, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Card: {
    borderRadius: " 1em 1em 1em / 1em 1em",
  },

  CardBody: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  CardHeader: {
    // borderBottom: "2px solid #cabbe9",
    display: "flex",
    flexDirection: "column",
    // backgroundColor: colors.grey[100],
  },
}));

export function BaseCard(props) {
  const classes = useStyles();
  return <Card className={classes.Card}>{props.children}</Card>;
}

export function CardBody(props) {
  const classes = useStyles();
  return <div className={classes.CardBody}>{props.children}</div>;
}

export function CardHeader(props) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.CardHeader}>{props.children}</div>
      <br></br>
    </div>
  );
}
