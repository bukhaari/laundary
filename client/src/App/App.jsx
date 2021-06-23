import clsx from "clsx";
import { useState, useEffect, memo } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useTheme } from "@material-ui/core/styles";
import AppHeader from "../components/Headers";
import DrawerList from "../components/DrawerList";
import HomePage from "../views/Home/HomePage";
import NewCompany from "../views/NewCompany";
import { useMediaQuery } from "@material-ui/core";
import RouteAuth from "../views/RouteAuth";
import NotFound from "../views/NotFound";
import { useAppStyles } from "./CSSApp";
import LoginPage from "../views/login";
import { useSelector } from "react-redux";
import { getSettings, isAuthenticated } from "../store/modules/auth";
import NewBranch from "../views/Home/Branch/newBranch";
import UserRoles from "../views/Users/roles";
import UserList from "../views/Users/UserList";
import Client from "../views/Client";
// import ClientForm from "../views/Client/clientForm";
import Orders from "../views/Orders";
import Service from "../views/service";
import Employees from "../views/Employees";

const drawerWidth = 240;

let initialRoutes = [
  //luandary components / start
  {
    path: "/clients",
    exact: true,
    page: Client,
  },
  {
    path: "/newOrder",
    exact: true,
    page: Orders,
  },
  {
    path: "/service",
    exact: true,
    page: Service,
  },
  {
    path: "/employees",
    exact: true,
    page: Employees,
  },

  //end
  {
    path: "/userrole",
    exact: true,
    page: UserRoles,
  },
  {
    path: "/userlist",
    exact: true,
    page: UserList,
  },
  {
    path: "/",
    exact: true,
    page: HomePage,
  },
];
if (process.env.NODE_ENV === "development") {
  initialRoutes.unshift({
    path: "/newcomp",
    page: NewCompany,
  });
  initialRoutes.unshift({
    path: "/newbranch",
    page: NewBranch,
  });
}

function App() {
  const [routes] = useState(initialRoutes);
  const [open, setOpen] = useState(true);
  const authSettings = useSelector(getSettings);
  const duration = authSettings.duration;
  const appParColor = authSettings.appParColor;
  const textColor = authSettings.textColor;
  const classes = useAppStyles(drawerWidth)({
    duration,
    appParColor,
    textColor,
    drawerWidth,
  });

  let theme = useTheme();
  let isNotMobile = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    setOpen(isNotMobile);
  }, [isNotMobile]);

  const handleDrawer = () => {
    setOpen(!open);
  };
  const Auth = useSelector(isAuthenticated);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!Auth) setOpen(false);
  });
  useEffect(() => {
    if (Auth) setOpen(true);
  }, [Auth]);

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppHeader
          open={open}
          drawerWidth={drawerWidth}
          handleDrawerOpen={handleDrawer}
        ></AppHeader>
        <DrawerList
          isOpen={open}
          handledClose={handleDrawer}
          drawerWidth={drawerWidth}
          duration={duration}
        ></DrawerList>

        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/404">
              <NotFound />
            </Route>
            {routes.map((route) => {
              return route.path === "/newcomp" ? (
                <Route key={route.path} path={route.path}>
                  <route.page></route.page>
                </Route>
              ) : (
                <RouteAuth
                  key={route.path}
                  path={route.path}
                  exact={!!route.exact}
                >
                  <route.page></route.page>
                </RouteAuth>
              );
            })}
            <Redirect to="404" />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default memo(App);
