import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AddButton from "../../views/Employees/employeeForm";
import PageHeader from "./../../components/common/pageHeader";
import { BaseCard, CardHeader } from "../../components/common/BaseCard";
import { getAllEmployees, loadEmployees } from "../../store/modules/Employees";
import BaseTable from "../../components/controls/BaseTable";

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

  let Header = [
    { field: "name", headerName: "Name" },
    { field: "phone", headerName: "Phone" },
    { field: "address", headerName: "Address" },
    { field: "action", headerName: "Action" },
  ];

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
              <BaseTable
                header={Header}
                items={employees.map((s) => {
                  const employee = { ...s };
                  employee.action = (
                    <AddButton
                      titlePopUp="Employee Registration"
                      isNewOrUpdate={employee}
                    />
                  );
                  return employee;
                })}
              />
            </BaseCard>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default memo(Empolyee);
