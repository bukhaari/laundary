import React, { memo, useState, useEffect } from "react";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import ServiceForm from "../../views/service/serviceForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllService, loadServices } from "../../store/modules/service";
import DataTable from "material-datatable";
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

  useEffect(() => {
    dispatch(loadServices());
  }, []);


  const options = {
    // filterType: "checkbox",
    // filterType: 'multiselect',
    filter: false,
    selectableRows: false,
    usePaperPlaceholder: false,
    responsive: 'stacked',
    rowsPerPage: 10,
    componentWillReceiveProps: true,
    page: 0,
    sortColumnIndex: 2,
    sortColumnDirection: "desc",
    sortFilterList:false,
    print:false,
    download:true,
    viewColumns:true,
    pagination:true,
  };

  const TableData = {
    columns :[
      {
        name: "Name",
        field: "item",
      },
      {
        name: "washing",
        field: "washing",
      },
      {
        name: "ironing",
        field: "ironing",
      },
      {
        name: "ExWashing",
        field: "ExWashing",
      },
      {
        name: "ExIroning",
        field: "ExIroning",
      },
      {
        name: "action",
        field: "action",
        options: {
          filter: false,
          sort: false,
         }
      },
    ],
    data: services.map(s=> {
      const service = {...s}
      service.action =  <Button size="small" className={classes.buttonAction}> Edit
      </Button>
      return service
    })
  }
  return (
    <Container maxWidth="lg">
      <div className={classes.pageContent}>
        <BaseCard>
          <CardHeader>
            <Grid container>
              <Grid item xs={12} sm={12}>
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
          <DataTable
            title={"Services List"}
            data={TableData.data}
            columns={TableData.columns}
            options={options}
          />
        </BaseCard>
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
