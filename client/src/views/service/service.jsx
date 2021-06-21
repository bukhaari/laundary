import React, { memo, useState } from "react";
import {
  colors,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import BaseButton from "../../components/controls/BaseButton";
import DataTable from "../../components/Table/DataTable";
import { BaseCard } from "../../components/common/BaseCard";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
  },

  CardClass: {
    borderRadius: " 1em 1em 1em / 1em 1em",
    padding: theme.spacing(1),
    margin: theme.spacing(2),
  },

  CardBodyClass: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },

  CardHeaderClass: {
    padding: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.grey[100],
  },

  searchInput: {
    opacity: "0.6",
    padding: "opx 8px",
    fontSize: "1rem",
  },
}));

function Service() {
  const classes = useStyles();

  const [CartService, setCart] = useState([
    {
      id: 1,
      item: "SHIRTS",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
    {
      id: 2,
      item: "TROUSER",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
    {
      id: 3,
      item: "T-SHIRT",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
    {
      id: 4,
      item: "T-SHIRT",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
    {
      id: 5,
      item: "T-SHIRT",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
    {
      id: 6,
      item: "T-SHIRT",
      washing: 70,
      ironing: 30,
      ExWashing: 90,
    },
  ]);

  const HeaderCells = [
    { id: "item", label: "Item" },
    { id: "washing", label: "Washing" },
    { id: "ironing", label: "Ironing" },
    { id: "ExWashing", label: "Expr Washing" },
    { id: "ExIroning", label: "Expr Ironing" },
  ];

  const { TblContainer, RecordsPagination } = DataTable(
    CartService,
    HeaderCells
  );

  return (
    <div className={classes.pageContent}>
      <BaseCard>
        <TblContainer>
          <TableBody>
            {RecordsPagination().map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.item}</TableCell>
                <TableCell>{c.washing}</TableCell>
                <TableCell>{c.ironing}</TableCell>
                <TableCell>{c.ExWashing}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
      </BaseCard>
    </div>
  );
}

export default memo(Service);
