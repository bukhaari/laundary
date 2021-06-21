import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadBranches, getAllBranches } from "../../store/modules/Branch";
import BranchView from "./Branch/branchView";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
}));

export default function SupperHome() {
  const classes = useStyles();
  const branches = useSelector(getAllBranches);

  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadBranches());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />

      <Container className={classes.root} maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-start" justify="center">
          {branches.map((branch) => (
            <Grid item key={branch._id} xs={12} sm={6} md={4}>
              <BranchView branch={branch} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}
