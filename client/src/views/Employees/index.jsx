import React, { memo, useEffect } from "react";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import AddButton from "../../views/Employees/employeeForm";
import { useSelector, useDispatch } from "react-redux";
import { getAllEmployees, loadEmployees } from "../../store/modules/Employees";
import DataTable from "material-datatable";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import PageHeader from "./../../components/common/pageHeader";

import { makeStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(4),
  },
}));

function Empolyee() {
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
      employee.action = (
        <AddButton
          titlePopUp="Employee Registration"
          isNewOrUpdate={employee}
        />
      );
      return employee;
    }),
  };
  return (
    <div>
      <PageHeader
        title="Employees"
        subTitle="Employees Information"
        Icon={<GroupAddIcon />}
      />
      <div className={classes.pageContent}>
        <Grid container>
          <Grid item xs={12} sm={12}>
            <BaseCard>
              <CardHeader>
                <AddButton
                  titlePopUp="Employee Registration"
                  isNewOrUpdate="new"
                />
              </CardHeader>
              <DataTable
                title={"Employees"}
                data={TableData.data}
                columns={TableData.columns}
                options={options}
              />
            </BaseCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default memo(Empolyee);
