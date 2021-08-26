import { useState } from "react";
import PopupDiolog from "../../components/common/PopUpDiolog";
import BaseInput from "../../components/controls/BaseInput";
import { useRules } from "../../Hooks/useRueles";
import { useDispatch } from "react-redux";
import BaseButton from "../../components/controls/BaseButton";
import { addNewService, updateService } from "../../store/modules/service";
import AddIcon from "@material-ui/icons/Add";
import Notification from "../../components/common/Notification";
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

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(4),
    float: "right",
  },
  pageContent: {
    marginTop: theme.spacing(5),
    margin: theme.spacing(4),
  },
}));

const breakPoin = { xs: 12, sm: 6 };

function ServiceForm({ titlePopUp, isNewOrUpdate = {} }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [PopUp, setPopUp] = useState(false);
  let [errMsg, setErrorMsg] = useState("");
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const isRequired = (v) => {
    return !!v || "is Required";
  };

  const handlePopUp = () => {
    setPopUp(true);
    data.clear();
  };

  const editeData = {
    _id: isNewOrUpdate._id || 0,
    item: isNewOrUpdate.item || "",
    washing: isNewOrUpdate.washing || "",
    ExWashing: isNewOrUpdate.ExWashing || "",
    ironing: isNewOrUpdate.ironing || "",
    ExIroning: isNewOrUpdate.ExIroning || "",
  };

  const { bindProps, data } = useRules({
    data: editeData,
  });

  let [loading, setLoading] = useState(false);

  const formSubmit = async (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);

      try {
        if (isNewOrUpdate._id) {
          await dispatch(updateService(data.values));
          data.clear();
          isNewOrUpdate = {};
          setPopUp(false);
          setLoading(false);
          setNotify({
            isOpen: true,
            message: `${data.values.item} Successfully to updated`,
            type: "success",
          });
          return;
        }

        if (isNewOrUpdate === "new") {
          await dispatch(addNewService(data.values));
          data.clear();
          isNewOrUpdate = {};
          setLoading(false);
          setNotify({
            isOpen: true,
            message: `${data.values.item} Successfully to Created`,
            type: "success",
          });
          return;
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      {isNewOrUpdate !== "new" ? (
        <IconButton size={"small"} onClick={() => handlePopUp()}>
          <Icon style={{ color: "#0b8457" }} color="inherit">
            edit
          </Icon>
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          size={"small"}
          style={{ fontSize: "15px" }}
          onClick={() => handlePopUp()}
        >
          <AddIcon /> Add New
        </IconButton>
      )}

      <Grid container>
        <Grid item sm={6} md={12}>
          <PopupDiolog
            title={titlePopUp}
            OpenPopUp={PopUp}
            setOpenPopUp={setPopUp}
          >
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
                        {...bindProps("item")}
                        rules={[isRequired]}
                        deps={[errMsg]}
                        variant="outlined"
                        required
                        fullWidth
                        label="Item"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("washing")}
                        rules={[isRequired]}
                        variant="outlined"
                        required
                        deps={[errMsg]}
                        fullWidth
                        type="number"
                        label="Washing"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("ironing")}
                        rules={[isRequired]}
                        deps={[errMsg]}
                        variant="outlined"
                        required
                        type="number"
                        fullWidth
                        label="Ironing"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("ExWashing")}
                        rules={[isRequired]}
                        variant="outlined"
                        required
                        type="number"
                        fullWidth
                        label="ExWashing"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseInput
                        {...bindProps("ExIroning")}
                        rules={[isRequired]}
                        variant="outlined"
                        required
                        type="number"
                        fullWidth
                        label="ExIroning"
                      />
                    </Grid>
                    <Grid item {...breakPoin}>
                      <BaseButton
                        loading={loading}
                        label={isNewOrUpdate._id ? "Update" : "Submit"}
                      />
                    </Grid>
                  </Grid>
                </form>
                <Grid container justify="center">
                  <Grid item>
                    <Box>
                      <Typography
                        color="error"
                        component="h1"
                        variant="subtitle2"
                      >
                        {errMsg && JSON.stringify(errMsg)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </PopupDiolog>
        </Grid>
      </Grid>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
}

export default ServiceForm;
// export default NewCompany;
