import React, { memo, useEffect, useState } from "react";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import AddButton from "../../views/Employees/employeeForm";
import DataTable from "material-datatable";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import PageHeader from "./../../components/common/pageHeader";
import BaseTable from "../../components/controls/BaseTable";
import { useDispatch } from "react-redux";
import { getAllClient } from "./../../store/modules/Client/index";
import { makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(4),
  },
}));

function Client() {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const employees = useSelector(getAllEmployees);
  const [Clients, setClients] = useState([]);

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

  const options = {
    // filterType: "checkbox",
    // filterType: 'multiselect',
    filter: false,
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

  // const TableData = {
  //   columns: [
  //     {
  //       name: "Name",
  //       field: "name",
  //     },
  //     {
  //       name: "Phone",
  //       field: "phone",
  //     },
  //     {
  //       name: "Address",
  //       field: "address",
  //     },
  //     {
  //       name: "action",
  //       field: "action",
  //       options: {
  //         filter: false,
  //         sort: false,
  //       },
  //     },
  //   ],
  //   data: employees.map((s) => {
  //     const employee = { ...s };
  //     employee.action = (
  //       <AddButton
  //         titlePopUp="Employee Registration"
  //         isNewOrUpdate={employee}
  //       />
  //     );
  //     return employee;
  //   }),
  // };

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
        <Grid container>
          <Grid item xs={12} sm={12}>
            <BaseCard>
              <BaseTable
                header={Header}
                items={
                  Clients.length === 0
                    ? []
                    : Clients.map((row) => {
                        const data = { ...row };
                        data.time = new Date(data.Date).toLocaleTimeString();
                        data.date = new Date(data.Date).toDateString();
                        return data;
                      })
                }
              />
            </BaseCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default memo(Client);
