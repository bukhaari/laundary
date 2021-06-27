import { memo } from "react";
import ServiceForm from "./serviceForm";
import PaymentForm from "./paymentForm";
import TableOrder from "./tableOrder";
import PageHeader from "./../../components/common/pageHeader";
import { Grid, CssBaseline, makeStyles } from "@material-ui/core";
import LocalMallIcon from "@material-ui/icons/LocalMall";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
}));

function Order() {
  const classes = useStyles();

  return (
    <main>
      <PageHeader
        title="Order Service"
        subTitle="Ordering Information"
        Icon={<LocalMallIcon />}
      />
      <div className={classes.pageContent}>
        <CssBaseline />
        <Grid container spacing={3}>
          <Grid item md={6}>
            <ServiceForm />
          </Grid>

          <Grid item md={6}>
            <PaymentForm />
          </Grid>

          <Grid item md={12}>
            <TableOrder />
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default memo(Order);
