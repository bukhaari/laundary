import { useDispatch } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import React, { memo, useEffect, useState } from "react";
import BaseTable from "../../components/controls/BaseTable";
import PageHeader from "./../../components/common/pageHeader";
import { makeStyles, Grid, InputBase } from "@material-ui/core";
import { getAllClient } from "./../../store/modules/Client/index";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(4),
  },
  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

function Client() {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const employees = useSelector(getAllEmployees);
  const [Clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handleClient = async () => {
      try {
        const { data } = await dispatch(getAllClient());
        setClients(data);
      } catch (error) {
        console.log(error);
      }
    };
    handleClient();
  }, []);

  let Header = [
    { field: "name", headerName: "Name" },
    { field: "number", headerName: "number" },
    { field: "date", headerName: "Date" },
    { field: "time", headerName: "Time" },
  ];

  return (
    <div>
      <PageHeader
        title="Clients"
        subTitle="Client Information"
        Icon={<GroupAddIcon />}
      />
      <div className={classes.pageContent}>
        <BaseCard>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <CardHeader>
                <InputBase
                  placeholder="Searching"
                  className={classes.searchInput}
                  startAdornment={<SearchIcon />}
                  onChange={handleSearch}
                />
              </CardHeader>
            </Grid>
            <Grid item xs={12}>
              <BaseTable
                header={Header}
                items={
                  Clients.length === 0
                    ? []
                    : Clients.filter((s) => {
                        if (searchQuery === "") {
                          return s;
                        } else if (
                          s.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ) {
                          return s;
                        }
                      }).map((row) => {
                        const data = { ...row };
                        data.time = new Date(data.Date).toLocaleTimeString();
                        data.date = new Date(data.Date).toDateString();
                        return data;
                      })
                }
              />
            </Grid>
          </Grid>
        </BaseCard>
      </div>
    </div>
  );
}

export default memo(Client);
