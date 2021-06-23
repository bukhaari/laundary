import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import PaginationSortingFilter from "./TableHeaders";
import {
  TableBody,
  TableRow,
  TableCell,
  InputBase,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
    margin: theme.spacing(3),
  },
  titleText: {
    margin: theme.spacing(3),
    fontWeight: "300",
    fontSize: "17px",
  },
  textSpan: {
    color: "#10316b",
    fontWeight: "600",
    fontSize: "17px",
    letterSpacing: "6px",
    textAlign: "center",
  },
}));

function TblBody({ data, title = "Info", searchFieldName }) {
  const classes = useStyles();

  //Initial Search state
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x[searchFieldName].toLowerCase().includes(target.value)
          );
      },
    });
  };

  const { TblContainer, RecordsPagination } = PaginationSortingFilter(
    data.rows,
    data.columns,
    filterFn
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={9} sm={9}>
          <Typography className={classes.titleText}>
            {title} into the database are
            <span className={classes.textSpan}> {data.rows.length}</span>
            record
          </Typography>
        </Grid>
        <Grid item xs={3} sm={3}>
          <InputBase
            placeholder="Searching"
            className={classes.searchInput}
            startAdornment={<SearchIcon />}
            onChange={handleSearch}
          />
        </Grid>
      </Grid>
      <TblContainer>
        <TableBody>
          {RecordsPagination().map((row) => {
            return (
              <TableRow key={row._id}>
                {data.columns.map((column) => (
                  <TableCell key={column.id}>{row[column.id]}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </TblContainer>
    </div>
  );
}

export default TblBody;
