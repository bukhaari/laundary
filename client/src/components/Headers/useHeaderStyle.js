import { makeStyles } from "@material-ui/core";

export const useHeaderStyle = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    transition: ({ duration }) => {
      return theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: duration,
        // duration: theme.transitions.duration.leavingScreen,
      });
    },
    color: ({ fg }) => fg,
    backgroundColor: ({ bg }) => {
      return bg;
    },
  },
  appBarShift: {
    [theme.breakpoints.up("sm")]: {
      width: ({ drawerWidth }) => `calc(100% - ${drawerWidth}px)`,
      marginLeft: ({ drawerWidth }) => drawerWidth,
      transition: ({ duration }) =>
        theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: duration,
          // duration: theme.transitions.duration.enteringScreen,
        }),
    },
  },
  title: {
    flexGrow: 1,
  },
  appColor: {
    color: ({ fg }) => fg,
    backgroundColor: ({ bg }) => {
      // console.log(bg);
      return bg;
    },
  },
}));
