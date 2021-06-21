import {
  Typography,
  CardContent,
  Icon,
  CardHeader,
  makeStyles,
  Card,
  CardActions,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useState } from "react";
import BaseButton from "../../../components/controls/BaseButton";
import { switchBranch } from "../../../store/modules/auth";
import EditeBranch from "./EditeBranch";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },

  cardColor: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
}));

function BranchView({ branch }) {
  const classes = useStyles();
  const [loading, setLoading] = useState();
  let dispatch = useDispatch();
  const onOpenBranch = () => {
    setLoading(true);
    dispatch(switchBranch(branch))
      .then((val) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <Card elevation={6}>
        <CardHeader
          title={branch.BranchName}
          titleTypographyProps={{ align: "center" }}
          style={{
            backgroundColor: branch.appParColor,
            color: branch.textColor,
          }}
          action={<EditeBranch branch={branch} />}
          // action={
          //   <IconButton color="inherit">
          //     <Icon>mode</Icon>
          //   </IconButton>
          // }
        />
        <CardContent className={classes.cardColor}>
          <ul>
            <Typography component="li" variant="subtitle1" align="center">
              Phone: {branch.phone}
            </Typography>
            <Typography component="li" variant="subtitle1" align="center">
              Base Cash: {branch.CashBase}
            </Typography>
            <Typography component="li" variant="subtitle1" align="center">
              Country: {branch.country}
            </Typography>
            <Typography component="li" variant="subtitle1" align="center">
              City: {branch.city}
            </Typography>
          </ul>
        </CardContent>
        <CardActions className={classes.cardColor}>
          <BaseButton
            onClick={onOpenBranch}
            loading={loading}
            type="button"
            fullWidth
            variant="outlined"
            color="primary"
            endIcon={<Icon>login</Icon>}
          >
            open
          </BaseButton>
        </CardActions>
      </Card>
    </>
  );
}

export default BranchView;
