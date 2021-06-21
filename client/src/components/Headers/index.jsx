import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { useSelector, useDispatch } from "react-redux";
import {
  getSettings,
  getUser,
  isAuthenticated,
  logOutAction,
  baranchExit,
  getBranches,
} from "../../store/modules/auth";
import { Icon } from "@material-ui/core";
import { memo } from "react";
import { useHistory } from "react-router-dom";
import { useHeaderStyle } from "./useHeaderStyle";

function AppHeader(props) {
  const { open, drawerWidth, ...rest } = props;
  let history = useHistory();
  const authSelector = useSelector(getSettings);
  const { BranchName } = useSelector(getBranches) || { BranchName: null };
  const User = useSelector(getUser);
  const Auth = useSelector(isAuthenticated);
  const duration = authSelector.duration;
  const appParColor =
    history.location.pathname === "/login"
      ? authSelector.loginHeadColor
      : authSelector.appParColor;
  const textColor =
    history.location.pathname === "/login"
      ? authSelector.loginColor
      : authSelector.textColor;
  const { systemName, isWitch } = User;

  const classes = useHeaderStyle({
    bg: appParColor,
    fg: textColor,
    drawerWidth,
    duration,
  });
  let dispatch = useDispatch();
  const onLogut = () => {
    dispatch(logOutAction());
    history.push("/login");
  };
  const switchBack = () => {
    dispatch(baranchExit()).then(() => {
      if (history.location.pathname !== "/") history.replace("/");
    });
  };

  // console.log(test);
  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="inherit"
      >
        <Toolbar>
          {Auth && (
            <IconButton
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
              color="inherit"
              aria-label="open drawer"
              onClick={rest.handleDrawerOpen}
            >
              <Icon>{open ? "menu_open" : "menu"}</Icon>
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            {systemName && systemName.toUpperCase()}{" "}
            {BranchName ? `( ${BranchName} )` : ""}
          </Typography>
          {Auth && isWitch && (
            <IconButton
              onClick={switchBack}
              title="switch-back"
              color="inherit"
            >
              <Icon>power_settings_new</Icon>
            </IconButton>
          )}
          {Auth && !open && (
            <IconButton title="logout" onClick={onLogut} color="inherit">
              <Icon>logout</Icon>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
export default memo(AppHeader);
