import SearchIcon from "@material-ui/icons/Search";
import { useSelector, useDispatch } from "react-redux";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import React, { memo, useEffect, useState } from "react";
import AddButton from "../../views/Employees/employeeForm";
import { BaseCard } from "../../components/common/BaseCard";
import BaseTable from "../../components/controls/BaseTable";
import PageHeader from "./../../components/common/pageHeader";
import { makeStyles, Grid, InputBase } from "@material-ui/core";
import { getAllEmployees, loadEmployees } from "../../store/modules/Employees";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    marginTop: theme.spacing(2),
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

function Empolyee() {
  const classes = useStyles();
  const employees = useSelector(getAllEmployees);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
                titlePopUp="Employee Registration"
                isNewOrUpdate="new"
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </BaseCard>
      </div>
    </div>
  );
}

export default memo(Empolyee);
