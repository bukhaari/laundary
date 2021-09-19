import SearchIcon from "@material-ui/icons/Search";
import { useSelector, useDispatch } from "react-redux";
import AddButton from "../../views/service/ServiceForm";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import React, { memo, useEffect, useState } from "react";
import BaseTable from "../../components/controls/BaseTable";
import PageHeader from "./../../components/common/pageHeader";
import { makeStyles, Grid, InputBase } from "@material-ui/core";
import { getAllService, loadServices } from "../../store/modules/service";
import { BaseCard } from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
  },
  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

function Service() {
  const classes = useStyles();
  const ServicesData = useSelector(getAllService);
  // const [Services, setServices] = useState([]);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleService = async () => {
      const { data: result } = await dispatch(loadServices());
      // setServices(result);
    };
    handleService();
  }, []);

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
        <BaseCard>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputBase
                placeholder="Searching"
                className={classes.searchInput}
                startAdornment={<SearchIcon />}
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={6}>
              <AddButton
                titlePopUp="Services Registration"
                isNewOrUpdate="new"
              />
            </Grid>
            <Grid item xs={12}>
              <BaseTable
                header={Header}
                items={ServicesData.filter((s) => {
                  if (searchQuery === "") {
                    return s;
                  } else if (
                    s.item.toLowerCase().includes(searchQuery.toLowerCase())
                  ) {
                    return s;
                  }
                }).map((service) => ({
                  ...service,
                  action: (
                    <AddButton
                      titlePopUp="Services Registration"
                      isNewOrUpdate={service}
                    />
                  ),
                }))}
              />
            </Grid>
          </Grid>
        </BaseCard>
      </div>
    </div>
  );
}

export default memo(Service);
