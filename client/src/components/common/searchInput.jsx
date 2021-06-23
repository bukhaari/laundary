import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table: {
    "& thead th": {
      fontWeight: "600",
      fontSize: "17px",
    },
    "& thead tr:hover": {
      cursor: "pointer",
    },
    "& tbody td": {
      fontSize: "15px",
    },

    "& tbody tr:hover": {
      backgroundColor: "#dee1ec",
      cursor: "pointer",
    },
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
  searchInput: {
    opacity: "0.8",
    padding: "opx 8px",
    fontSize: "1.3rem",
    margin: theme.spacing(2),
    marginLeft: theme.spacing(20),
  },
}));

const SearchMethod = () => {
  const classes = useStyles();
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const handleSearch = (e) => {
    let target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value == "") return items;
        else
          return items.filter((x) =>
            x.item.toLowerCase().includes(target.value)
          );
      },
    });
  };
  const InputSearch = () => {
    return (
      <InputBase
        placeholder="Searching"
        className={classes.searchInput}
        startAdornment={<SearchIcon />}
        onChange={handleSearch}
      />
    );
  };
  return { InputSearch, filterFn };
};

export default SearchMethod;
