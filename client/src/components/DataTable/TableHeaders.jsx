import React, { useState } from "react";
import {
  makeStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  TableSortLabel,
} from "@material-ui/core";

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
}));

export default function DataTable(rows, headCells, filterFn) {
  const classes = useStyles();

  //Pagination Initials
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const TblPagination = () => (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={rows.length}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );

  //Sorting initials
  const [Order, setOrder] = useState();
  const [OrderBy, setOrderBy] = useState();

  const TblHead = () => {
    const handleSortRequest = (cellId) => {
      const isAsc = OrderBy === cellId && Order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((h) => (
            <TableCell
              key={h.id}
              sortDirection={OrderBy === h.id ? Order : false}
            >
              <TableSortLabel
                active={OrderBy === h.id}
                direction={OrderBy === h.id ? Order : "asc"}
                onClick={() => handleSortRequest(h.id)}
              >
                {h.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
//here
  const RecordsPagination = () => {
    return stableSort(
      filterFn.fn(rows),
      getComparator(Order, OrderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  const TblContainer = (props) => (
    <div>
      <Table className={classes.table}>
        <TblHead />
        {props.children}
      </Table>
      <TblPagination />
    </div>
  );

  return { TblContainer, RecordsPagination };
}
