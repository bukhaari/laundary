import React, { memo, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import AddButton from "../../views/service/ServiceForm";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import BaseTable from "../../components/controls/BaseTable";
import PageHeader from "./../../components/common/pageHeader";
import { getAllService, loadServices } from "../../store/modules/service";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(2.5),
  },
}));

function Service() {
  const classes = useStyles();
  const ServicesData = useSelector(getAllService);
  // const [Services, setServices] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleService = async () => {
      const { data: result } = await dispatch(loadServices());
      // setServices(result);
    };
    handleService();
  }, []);

  const options = {
    // filterType: "checkbox",
    // filterType: 'multiselect',
    filter: false,
    // serverSide: true,
    selectableRows: false,
    usePaperPlaceholder: true,
    responsive: "scroll",
    rowsPerPage: 10,
    componentWillReceiveProps: true,
    page: 0,
    sortColumnIndex: 2,
    sortColumnDirection: "desc",
    sortFilterList: true,
    print: true,
    download: true,
    viewColumns: true,
    pagination: true,
  };

  const columns = [
    {
      name: "Item",
      field: "item",
    },
    {
      name: "Washing",
      field: "washing",
    },
    {
      name: "Ironing",
      field: "ironing",
    },
    {
      name: "Expr Washing",
      field: "ExWashing",
    },
    {
      name: "Expr Ironing",
      field: "ExIroning",
    },
    {
      name: "action",
      field: "action",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  let Header = [
    { field: "item", headerName: "Item" },
    { field: "washing", headerName: "Washing" },
    { field: "ironing", headerName: "Ironing" },
    { field: "ExWashing", headerName: "Expr Washing" },
    { field: "ExIroning", headerName: "Expr Ironing" },
    { field: "action", headerName: "Action" },
    // { field: "date", headerName: "Date" },
    // { field: "time", headerName: "Time" },
  ];

  return (
    <div>
      <PageHeader
        title="Service"
        subTitle="Services Information"
        Icon={<LocalMallIcon />}
      />
      <div className={classes.pageContent}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <BaseCard>
              <CardHeader>
                <AddButton
                  titlePopUp="Services Registration"
                  isNewOrUpdate="new"
                />
              </CardHeader>
              <BaseTable
                header={Header}
                items={ServicesData.map((service) => ({
                  ...service,
                  action: (
                    <AddButton
                      titlePopUp="Services Registration"
                      isNewOrUpdate={service}
                    />
                  ),
                }))}
              />
            </BaseCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default memo(Service);
