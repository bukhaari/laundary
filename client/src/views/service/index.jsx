import React, { memo, useState, useEffect } from "react";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import ServiceForm from "../../views/service/serviceForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllService, loadServices } from "../../store/modules/service";
import DataTable from "../../components/DataTable";
import {
  makeStyles,
  Grid,
  Button,
  Typography,
  Container,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
  },

  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
  },
  button: {
    background: "#0b8457",
    margin: theme.spacing(3),
    float: "right",
    color: "#fff",
  },
  buttonAction: {
    background: "#d72323",
    color: "#fff",
    fontSize: "10px",
  },
  titleText: {
    margin: theme.spacing(3),
    fontWeight: "600",
    fontSize: "17px",
  },
}));

function Service() {
  const classes = useStyles();
  const services = useSelector(getAllService);
  const dispatch = useDispatch();
  const [OpenPopUp, setOpenPopUp] = useState(false);

  const Title = "Services";

  useEffect(() => {
    dispatch(loadServices());
  }, []);

  const TableData = {
    columns: [
      { id: "item", label: "Item" },
      { id: "washing", label: "Washing" },
      { id: "ironing", label: "Ironing" },
      { id: "ExWashing", label: "Expr Washing" },
      { id: "ExIroning", label: "Expr Ironing" },
      { id: "action", label: "Action" },
    ],
    rows: services
      ? services.map((s) => {
          const servive = { ...s };
          servive.action = (
            <div>
              <Button size="small" className={classes.buttonAction}>
                Edit
              </Button>
            </div>
          );
          return servive;
        })
      : [],
  };
  return (
    <Container maxWidth="lg">
      <div className={classes.pageContent}>
        <BaseCard>
          <CardHeader>
            <Grid container>
              <Grid item xs={9} sm={9}>
                <Typography className={classes.titleText}>
                  Services Information
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Button
                  size="small"
                  className={classes.button}
                  onClick={() => setOpenPopUp(true)}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
          </CardHeader>
          <DataTable data={TableData} title={Title} searchFieldName={"item"} />
        </BaseCard>
        {/* columns={HeaderCells} rows={services} */}

        <ServiceForm
          title="Services Registration"
          OpenPopUp={OpenPopUp}
          setOpenPopUp={setOpenPopUp}
        />
      </div>
    </Container>
  );
}

export default memo(Service);
