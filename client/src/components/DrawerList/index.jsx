import clsx from "clsx";
import { useTheme, useMediaQuery, Drawer, makeStyles } from "@material-ui/core";

import PageLinks from "./PageLinks";
import { useSelector } from "react-redux";
import { getSettings } from "../../store/modules/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: ({ drawerWidth }) => drawerWidth,
    },
  },
  drawerOpen: {
    width: ({ drawerWidth }) => drawerWidth,
    transition: ({ duration }) =>
      theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: duration,
      }),
  },
  drawerClose: {
    transition: ({ duration }) =>
      theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: duration,
      }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },

  drawerPaper: {
    width: ({ drawerWidth }) => drawerWidth,
    backgroundColor: ({ sideColor }) => sideColor,
    color: ({ textColor }) => textColor,
    // display: "none",
  },
}));

const DrawerList = ({ isOpen, handledClose, drawerWidth, window }) => {
  const authSelector = useSelector(getSettings);
  const duration = authSelector.duration;
  const appParColor = authSelector.appParColor;
  const textColor = authSelector.textColor;
  const sideColor = authSelector.sideColor;

  // console.log(User);

  const classes = useStyles({ drawerWidth, duration, sideColor, textColor });
  const theme = useTheme();
  let isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  let variant = isMobile ? "temporary" : "persistent";
  //   console.log(children);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        container={container}
        transitionDuration={{ enter: duration, exit: duration }}
        variant={variant}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={isOpen}
        onClose={handledClose}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen,
        })}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <PageLinks textColor={textColor} appParColor={appParColor} />
      </Drawer>
    </nav>
  );
};

export default DrawerList;
