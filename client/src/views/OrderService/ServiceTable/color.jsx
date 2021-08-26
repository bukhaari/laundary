import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Button, Box, Grid } from "@material-ui/core";
import CustomDialog from "../../../components/CustomDialog";
import Brightness1Icon from "@material-ui/icons/Brightness1";

function Color({ setColorState, ColorState, row, value }) {
  const [openColor, setOpenColor] = React.useState(false);
  const handleModalColor = () => {
    setOpenColor(!openColor);
  };

  const [temColor, setTemColor] = useState("#fff");

  const handleComplateColor = (color) => {
    setTemColor(color.hex);
  };

  const handleAddColor = () => {
    let AllColorState = ColorState.filter((item) => item._id !== row._id);
    let current = ColorState.find((item) => item._id === row._id);
    // console.log("AllColorState", AllColorState);
    // console.log("current", current);

    const upd = {
      ...current,
      color: temColor,
      colors: [...current.colors, temColor],
    };
    setColorState((prevColor) => [...AllColorState, upd]);
    // console.log("ColorState", ColorState);
  };

  const handleDeleteColor = (index, id) => {
    // console.log("index", index);
    // console.log("id", id);
    let AllColorState = ColorState.filter((c) => c._id !== id);
    const current = ColorState.find((c) => c._id === id);
    // console.log("filterColors", filterColors);
    const currentColor = current.colors.filter((c, i) => i != index);

    const updateColors = {
      ...current,
      colors: currentColor,
    };
    // console.log("updateColors", updateColors);
    // console.log("current", current);
    // console.log("currentColor", currentColor);
    setColorState((prevColor) => [...AllColorState, updateColors]);
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        onClick={handleModalColor}
        color="primary"
      >
        Color
      </Button>
      <CustomDialog
        title={<div>Choose Color</div>}
        onClose={handleModalColor}
        open={openColor}
        dialogProp={{
          disableBackdropClick: true,
          scroll: "body",
          maxWidth: "md",
        }}
      >
        <Grid container>
          <Box>
            <Grid item xs={4}>
              <SketchPicker
                color={temColor}
                onChangeComplete={handleComplateColor}
              />
              <Button
                variant="contained"
                size="small"
                style={{ marginTop: "10px" }}
                onClick={handleAddColor}
                color="primary"
              >
                Add
              </Button>
            </Grid>
          </Box>
          <Box>
            <Grid item xs={8}>
              {value
                ? value.colors.map((c, index) => (
                    // <Button onClick={() => 1}>
                    <Brightness1Icon
                      key={index}
                      onClick={() => handleDeleteColor(index, value._id)}
                      style={{
                        color: c,
                        cursor: "pointer",
                        // boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.4)",
                        marginLeft: "5px",
                        border: "0.3px solid black",
                        borderRadius: "50px",
                      }}
                    />
                    // </Button>
                  ))
                : []}
            </Grid>
          </Box>
        </Grid>
      </CustomDialog>
    </div>
  );
}

export default Color;
