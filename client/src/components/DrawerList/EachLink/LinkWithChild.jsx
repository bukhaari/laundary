import clsx from "clsx";
import { useEffect } from "react";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  makeStyles,
  Icon,
  colors,
} from "@material-ui/core";
import FlateLink from "./LinkWithFlat";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSettings } from "../../../store/modules/auth";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  selected: {
    color: "black",
    backgroundColor: colors.grey[600],
  },
}));

function LinkWithChild({ link, handleClick, open }) {
  const location = useLocation();
  let Active = link.child.map(({ to }) => to).includes(location.pathname);
  // console.log(location);
  let { textColor } = useSelector(getSettings);
  useEffect(() => {
    let links = link.child.map((child) => child.to);
    if (!links.includes(location.pathname)) handleClick(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, link]);
  const classes = useStyles();
  // console.log({ [classes.selected]: Active });

  return (
    <>
      <ListItem
        className={clsx({ [classes.selected]: Active && !open })}
        // selected={Active && !open}
        button
        onClick={handleClick}
      >
        <ListItemIcon style={{ color: textColor }}>
          <Icon>{link.icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={link.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {link.child.map((item) => (
            <FlateLink
              link={item}
              className={classes.nested}
              key={item.title}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default LinkWithChild;
