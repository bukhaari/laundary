const { makeStyles, colors } = require("@material-ui/core");

export const useAppStyles = (drawerWidth) =>
  makeStyles((theme) => {
    return {
      root: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: colors.grey[200],
      },

      // necessary for content to be below app bar
      toolbar: theme.mixins.toolbar,

      drawarIMG: {
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
        backgroundColor: ({ appParColor, drawerWidth }) => {
          // setWidth(drawerWidth);
          return appParColor;
        },
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        // justifyContent: "space-evenly",
      },
      content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: ({ duration }) =>
          theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: duration,
            // duration: theme.transitions.duration.leavingScreen,
          }),
        [theme.breakpoints.up("sm")]: { marginLeft: -drawerWidth },
      },
      contentShift: {
        [theme.breakpoints.up("sm")]: {
          transition: ({ duration }) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: duration,
              // duration: theme.transitions.duration.enteringScreen,
            }),
          marginLeft: 0,
        },
      },
    };
  });
