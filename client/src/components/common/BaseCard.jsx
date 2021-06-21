import React from "react";
import { colors, Card, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  Card: {
    borderRadius: " 1em 1em 1em / 1em 1em",
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },

  CardBody: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  CardHeader: {
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[100],
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
  return <div className={classes.CardHeader}>{props.children}</div>;
}
