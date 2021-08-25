import React, { useEffect, useState } from "react";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import PageHeader from "../../components/common/pageHeader";
import { useDispatch } from "react-redux";
import BaseTable from "../../components/controls/BaseTable";
import { makeStyles } from "@material-ui/core";
import { loadOrderList } from "../../store/modules/Order";
import ItemsDialog from "./ItemsDialog";
import StatusInfo from "./StatusInfo/index";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: "black",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  order: {
    margin: theme.spacing(1, 0, 1),
  },
}));

function OrderList() {
  const classes = useStyles();
  const dispatch = useDispatch();

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
    { field: "item", headerName: "Items" },
    { field: "StatudInfo", headerName: "Status" },
  ];

  return (
    <div>
      <PageHeader
        title="Order List"
        subTitle="OrderList"
        Icon={<LocalMallIcon />}
      />
      <div className={classes.pageContent}>
        <BaseTable
          header={Header}
          items={
            OrderList.length === 0
              ? []
              : OrderList.map((row) => {
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
                      Items={data.itemsOrders}
                      ClientName={data.name}
                      text={data.status}
                    />
                  );
                  return data;
                })
          }
        />
      </div>
    </div>
  );
}

export default OrderList;
