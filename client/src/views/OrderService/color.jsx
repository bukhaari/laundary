import React from "react";
import { SketchPicker } from "react-color";
import { Button, Box, Grid } from "@material-ui/core";
import CustomDialog from "../../components/CustomDialog";
import Brightness1Icon from "@material-ui/icons/Brightness1";

function Color({ setColorState, ColorState, row, value }) {
  const [openColor, setOpenColor] = React.useState(false);
  const handleModalColor = () => {
    setOpenColor(!openColor);
  };

  const handleComplateColor = (color) => {
    let AllColorState = ColorState.filter((item) => item._id !== row._id);
    let current = ColorState.find((item) => item._id === row._id);
    console.log("AllColorState", AllColorState);
    console.log("current", current);

    const upd = {
      ...current,
      color: color.hex,
      colors: [...current.colors, color.hex],
    };
    setColorState((prevColor) => [...AllColorState, upd]);
    console.log("ColorState", ColorState);
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
                color={value ? value.color : "#FFF"}
                onChangeComplete={handleComplateColor}
              />
            </Grid>
          </Box>
          <Box>
            <Grid item xs={8}>
              {value
                ? value.colors.map((c, index) => (
                    <Button onClick={() => 1}>
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
                    </Button>
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
