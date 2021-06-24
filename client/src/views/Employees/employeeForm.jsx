import { memo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  CssBaseline,
  IconButton,
  Icon,
  makeStyles,
} from "@material-ui/core";
import PopupDiolog from "../../components/common/PopUpDiolog";
import BaseInput from "../../components/controls/BaseInput";
import { useRules } from "../../Hooks/useRueles";
import { useDispatch } from "react-redux";
import BaseButton from "../../components/controls/BaseButton";
import { addNewEmployee, updateEmployee } from "../../store/modules/Employees";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1.5),
    marginRight: theme.spacing(4),
    float: "right",
  },
}));

const breakPoin = { xs: 12, sm: 6 };

function EmployeeForm({ titlePopUp, isNewOrUpdate = {} }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [PopUp, setPopUp] = useState(false);
  let [errMsg, setErrorMsg] = useState("");

  const isRequired = (v) => {
    return !!v || "is Required";
  };

  const { bindProps, data } = useRules({
    data: {
      _id: isNewOrUpdate._id || 0,
      name: isNewOrUpdate.name || "",
      address: isNewOrUpdate.address || "",
      phone: isNewOrUpdate.phone || "",
    },
  });

  let [loading, setLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      if (isNewOrUpdate._id) {
        setErrorMsg("");
        setLoading(true);
        dispatch(updateEmployee(data.values));
        // data.clear();
        setLoading(false);
      }
      if (isNewOrUpdate === "new") {
        setErrorMsg("");
        setLoading(true);
        dispatch(addNewEmployee(data.values))
          .then((v) => {
            data.clear();
          })
          .catch((err) => {
            console.log(err.message);
            setErrorMsg(err.message);
          })
          .finally(() => setLoading(false));
      }
    }
  };

  return (
    <div>
      {isNewOrUpdate !== "new" ? (
        <IconButton size={"small"} onClick={() => setPopUp(true)}>
          <Icon style={{ color: "#d72323" }} color="inherit">
            edit
          </Icon>
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          size={"small"}
          onClick={() => setPopUp(true)}
        >
          <AddIcon style={{ fontSize: "35px" }} /> Add New
        </IconButton>
      )}

      <PopupDiolog title={titlePopUp} OpenPopUp={PopUp} setOpenPopUp={setPopUp}>
        <Container
          component="main"
          maxWidth="sm"
          style={{ marginTop: 25, marginBottom: 20 }}
        >
          <div>
            <CssBaseline />
            <form onSubmit={formSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("name")}
                    label="Name"
                    rules={[isRequired]}
                    deps={[errMsg]}
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("phone")}
                    rules={[isRequired]}
                    variant="outlined"
                    required
                    deps={[errMsg]}
                    fullWidth
                    type="number"
                    label="Phone Number"
                  />
                </Grid>
                <Grid item {...breakPoin}>
                  <BaseInput
                    {...bindProps("address")}
                    label="Address"
                    rules={[isRequired]}
                    deps={[errMsg]}
                    variant="outlined"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item {...breakPoin}>
                  <BaseButton
                    loading={loading}
                    label={isNewOrUpdate._id ? "Update" : "Create"}
                  />
                </Grid>
              </Grid>
            </form>
            <Grid container justify="center">
              <Grid item>
                <Box>
                  <Typography color="error" component="h1" variant="subtitle2">
                    {errMsg && JSON.stringify(errMsg)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Container>
      </PopupDiolog>
    </div>
  );
}

export default memo(EmployeeForm);
// export default NewCompany;
