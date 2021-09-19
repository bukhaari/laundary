import ItemsDialog from "./ItemsDialog";
import { useDispatch } from "react-redux";
import StatusInfo from "./StatusInfo/index";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import { loadOrderList } from "../../store/modules/Order";
import BaseTable from "../../components/controls/BaseTable";
import PageHeader from "../../components/common/pageHeader";
import { BaseCard } from "../../components/common/BaseCard";
import { Grid, makeStyles, InputBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.5),
  },

  order: {
    margin: theme.spacing(1, 0, 1),
  },
  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
}));

function OrderList() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const [OrderList, setOrderList] = useState([]);

  useEffect(async () => {
    const { data: NewOrderList } = await dispatch(loadOrderList());
    setOrderList(NewOrderList);
  }, []);

  let Header = [
    { field: "name", headerName: "Name" },
    { field: "number", headerName: "number" },
    { field: "type", headerName: "Type" },
    { field: "date", headerName: "Date" },
    { field: "time", headerName: "Time" },
    { field: "shelf", headerName: "Shelf" },
    { field: "item", headerName: "Items" },
    { field: "StatudInfo", headerName: "Status" },
  ];

  return (
    <div>
      <PageHeader
        title="Taken"
        subTitle="Taken Information"
        Icon={<LocalMallIcon />}
      />
      <div className={classes.pageContent}>
        <BaseCard>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <InputBase
                placeholder="Searching"
                className={classes.searchInput}
                startAdornment={<SearchIcon />}
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <BaseTable
                header={Header}
                items={
                  OrderList.length === 0
                    ? []
                    : OrderList.filter((s) => {
                        if (searchQuery === "") {
                          return s.status === "Missed" ||
                            s.status === "Taken" ||
                            s.status === "Queue"
                            ? ""
                            : s;
                        } else if (
                          s.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ) {
                          return s.status === "Missed" ? "" : s;
                        }
                      }).map((row) => {
                        const data = { ...row };
                        data.time = new Date(data.Date).toLocaleTimeString();
                        data.date = new Date(data.Date).toDateString();
                        data.item = (
                          <ItemsDialog
                            Items={data.itemsOrders}
                            ClientName={data.name}
                          />
                        );
                        data.StatudInfo = (
                          <StatusInfo
                            setOrderList={setOrderList}
                            OrderList={OrderList}
                            Items={data.itemsOrders}
                            balance={data.balance}
                            ClientName={data.name}
                            text={data.status}
                            orderId={data._id}
                          />
                        );
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

export default OrderList;
