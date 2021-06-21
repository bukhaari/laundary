import {
  makeStyles,
  Typography,
  Divider,
  List,
  Button,
  Icon,
} from "@material-ui/core";
import EachLink from "./EachLink/index";
import { useSelector, useDispatch } from "react-redux";
import {
  getLinks,
  getUser,
  isAuthenticated,
  logOutAction,
} from "../../store/modules/auth";
import { memo } from "react";
import { useHistory } from "react-router-dom";
import Changepass from "./Changepass";

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: "blue",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    // paddingRight: "2rem",
  },
  links: {
    flexGrow: 1,
  },
  logOut: {
    margin: "0.5rem",
  },
  drawerUser: {
    flexGrow: 1,
    textAlign: "center",
    maxWidth: 140,
  },
  drawarIMG: {
    cursor: "pointer",
    backgroundColor: "white",
    color: "black",
    marginRight: theme.spacing(3),
    height: theme.spacing(6),
    width: theme.spacing(6),
    border: "1px solid",
    // textDecoration: "underline",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    color: ({ textColor }) => textColor || "black",
    padding: theme.spacing(0, 1),
    backgroundColor: ({ appParColor }) => appParColor,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: "space-evenly",
  },
}));

function PageLinks({ textColor, appParColor }) {
  const links = useSelector(getLinks) || [];
  let User = useSelector(getUser);
  let Auth = useSelector(isAuthenticated);
  let history = useHistory();
  let { userName: logInName, UserType, FullName } = User;

  // console.log(history);

  const shortName = logInName && `${logInName[0]}${logInName[1]}`;
  const classes = useStyles({ appParColor, textColor });

  let dispatch = useDispatch();

  const onLogut = () => {
    dispatch(logOutAction());
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <div className={classes.drawerHeader}>
        <Changepass
          drawarIMG={classes.drawarIMG}
          children={shortName && shortName.toUpperCase()}
        />
        <div className={classes.drawerUser}>
          <Typography
            style={{ fontSize: "0.8rem", paddingTop: 10 }}
            variant="subtitle2"
            gutterBottom
            noWrap
          >
            {FullName && FullName.toUpperCase()}
          </Typography>
          <Typography
            noWrap
            variant="h6"
            style={{
              border: "1px solid",
              borderCollapse: "collapse",
            }}
          >
            {(logInName && logInName.toUpperCase()) || "--No User--"}
          </Typography>
          <Typography
            noWrap
            style={{
              fontSize: "0.8rem",
            }}
          >
            {(UserType && UserType.toUpperCase()) || "--No Type--"}
          </Typography>
        </div>
      </div>
      <Divider />
      <List className={classes.links} component="nav">
        {links.map((link) => (
          <EachLink key={link.title} link={link} />
        ))}
      </List>
      {!!links.length && <Divider />}
      {Auth && (
        <div className={classes.logOut}>
          <Button
            onClick={onLogut}
            fullWidth
            variant="contained"
            color="secondary"
            endIcon={<Icon>logout</Icon>}
          >
            logOut
          </Button>
        </div>
      )}
    </div>
  );
}

export default memo(PageLinks);
