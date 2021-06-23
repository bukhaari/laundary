import React, { memo, useState, useEffect } from "react";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import AddButton from "../../views/Employees/employeeForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllEmployees, loadEmployees } from "../../store/modules/Employees";
import DataTable from "material-datatable";
import AddIcon from "@material-ui/icons/Add";
import {
  makeStyles,
  Grid,
  Container,
  IconButton,
  Icon,
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
    margin: theme.spacing(1.5),
    marginRight: theme.spacing(4),
    float: "right",
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
  const employees = useSelector(getAllEmployees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadEmployees());
  }, []);

  const options = {
    // filterType: "checkbox",
    // filterType: 'multiselect',
    filter: false,
    selectableRows: false,
    usePaperPlaceholder: false,
    responsive: "stacked",
    rowsPerPage: 10,
    componentWillReceiveProps: true,
    page: 0,
    sortColumnIndex: 2,
    sortColumnDirection: "desc",
    sortFilterList: false,
    print: false,
    download: true,
    viewColumns: true,
    pagination: true,
  };

  const TableData = {
    columns: [
      {
        name: "Name",
        field: "name",
      },
      {
        name: "Phone",
        field: "phone",
      },
      {
        name: "Address",
        field: "address",
      },
      {
        name: "action",
        field: "action",
        options: {
          filter: false,
          sort: false,
        },
      },
    ],
    data: employees.map((s) => {
      const employee = { ...s };
      employee.action = <AddButton titlePopUp="info" isNewOrUpdate={employee} />;
      return employee;
    }),
  };
  return (
    <Container maxWidth="lg">
      <div className={classes.pageContent}>
        <BaseCard>
          <CardHeader>
            <Grid container>
              <Grid item xs={12} sm={12}>
                <AddButton titlePopUp="info" isNewOrUpdate="new" />
              </Grid>
            </Grid>
          </CardHeader>
          <DataTable
            title={"Employees"}
            data={TableData.data}
            columns={TableData.columns}
            options={options}
          />
        </BaseCard>
      </div>
    </Container>
  );
}

export default memo(Service);
