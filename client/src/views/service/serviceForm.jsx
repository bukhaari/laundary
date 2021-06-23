import { memo, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Box, Typography, Container, Grid } from "@material-ui/core";
import PopupDiolog from "../../components/common/PopUpDiolog";
import BaseInput from "../../components/controls/BaseInput";
import { useRules } from "../../Hooks/useRueles";
import { useDispatch } from "react-redux";
import BaseButton from "../../components/controls/BaseButton";
import { addNewService } from "../../store/modules/service";

const breakPoin = { xs: 12, sm: 6 };

function ServicesForm({ title, OpenPopUp, setOpenPopUp }) {
  const dispatch = useDispatch();

  let [errMsg, setErrorMsg] = useState("");

  const isRequired = (v) => {
    return !!v || "is Required";
  };

  const isGreatThan0 = (v) => {
    if (v < 0) return "is not less than 0";
    return true;
  };

  const { bindProps, data } = useRules({
    data: {
      item: "",
      domain: "riyoclean.com",
      washing: "",
      ironing: "",
      ExWashing: "",
      ExIroning: "",
    },
  });

  let [loading, setLoading] = useState(false);

  const formSubmit = (e) => {
    e.preventDefault();
    if (data.isValid()) {
      setErrorMsg("");
      setLoading(true);
      dispatch(addNewService(data.values))
        .then((v) => {
          data.clear();
        })
        .catch((err) => {
          console.log(err.message);
          setErrorMsg(err.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <PopupDiolog
      title={title}
      OpenPopUp={OpenPopUp}
      setOpenPopUp={setOpenPopUp}
    >
      <Container component="main" maxWidth="sm" style={{marginTop:25, marginBottom:20}}>
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
                rules={[isRequired, isGreatThan0]}
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
                rules={[isRequired, isGreatThan0]}
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
                rules={[isRequired, isGreatThan0]}
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
                rules={[isRequired, isGreatThan0]}
                variant="outlined"
                required
                type="number"
                fullWidth
                label="ExIroning"
              />
            </Grid>
            <Grid item {...breakPoin}>
            <BaseButton loading={loading} label="create" />
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
  );
}

export default memo(ServicesForm);
// export default NewCompany;
