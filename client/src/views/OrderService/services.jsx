import { FormikStep } from "../../components/common/Stepper";
import React from "react";
import BaseTable from "../../components/controls/BaseTable";
import SelectService from "./selectService";
import { makeStyles, IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyle = makeStyles((theme) => ({
  button: {
    color: "red",
  },
}));

function Service(props) {
  const classes = useStyle();
  const { handleservice, service } = props;

  let Header = [
    { field: "itemName", headerName: "Item" },
    { field: "qty", headerName: "Qty" },
    { field: "amount", headerName: "amount" },
    { field: "delete", headerName: "Delete" },
  ];

  const handleDelete = (id) => {
    const filterService = service.filter((s) => s._id !== id);
    handleservice(filterService);
  };

  return (
    <FormikStep>
      <SelectService handleservice={handleservice} />
      <BaseTable
        header={Header}
        items={service.map((s) => ({
          ...s,
          delete: (
            <IconButton
              className={classes.button}
              size={"small"}
              onClick={() => handleDelete(s._id)}
            >
              <DeleteForeverIcon />
            </IconButton>
          ),
        }))}
      />
    </FormikStep>
  );
}

export default Service;
