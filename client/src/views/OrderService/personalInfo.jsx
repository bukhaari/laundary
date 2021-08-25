import { FormikStep } from "../../components/common/Stepper";
import FormikControl from "../../components/controls/FormControl";
import { Grid, Card, CardContent, TextField } from "@material-ui/core";
import { getClient } from "./../../store/modules/Client/index";
import { useDispatch } from "react-redux";

function PersonalData({ personalData, setPersonalData }) {
  const dispatch = useDispatch();
  const { number, name } = personalData;
  const handleChange = (e) => {
    try {
      setPersonalData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetClient = async () => {
    try {
      const { data } = await dispatch(getClient(number));
      if (data._id) setPersonalData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormikStep>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                type="number"
                fullWidth
                placeholder="Number"
                name="number"
                size="small"
                onBlur={handleGetClient}
                variant="outlined"
                value={number}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                disabled={personalData._id ? true : false}
                label="Name"
                name="name"
                size="small"
                variant="outlined"
                value={name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormikStep>
  );
}

export default PersonalData;
