import React, { useState } from "react";
import { makeStyles, Badge } from "@material-ui/core";
import CustomDialog from "../../components/CustomDialog";
import BaseTable from "../../components/controls/BaseTable";
import Brightness1Icon from "@material-ui/icons/Brightness1";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
  },
}));

function ItemsDialog({ Items = [], ClientName }) {
  const [openItems, setItems] = useState(false);
  const handleModalItems = () => {
    setItems(!openItems);
  };

  let Header = [
    { field: "itemName", headerName: "Item Name" },
    { field: "qty", headerName: "QTY" },
    { field: "color", headerName: "Color" },
  ];

  return (
    <div>
      <Badge
        onClick={handleModalItems}
        color="primary"
        badgeContent={"Items"}
        style={{ cursor: "pointer" }}
      ></Badge>

      <CustomDialog
        title={<div>{ClientName}</div>}
        onClose={handleModalItems}
        open={openItems}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "md",
        }}
      >
        <BaseTable
          header={Header}
          items={Items.map((i) => {
            i.color = i.colors.map((c, index) => (
              <Brightness1Icon
                key={index}
                style={{
                  color: c,
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.4)",
                  marginLeft: "3spx",
                  border: "0.3px solid black",
                  borderRadius: "50px",
                }}
              />
            ));
            return i;
          })}
        />
      </CustomDialog>
    </div>
  );
}

export default ItemsDialog;
