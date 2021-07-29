import { FormikStep } from "../../components/common/Stepper";
import FormikControl from "../../components/controls/FormControl";
import { Grid, Card, CardContent, CardHeader } from "@material-ui/core";

function PersonalData() {
  return (
    <FormikStep>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <FormikControl
                control="field"
                type="number"
                name="number"
                lable="Number"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormikControl control="field" name="name" lable="Name" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormikStep>
  );
}

export default PersonalData;
