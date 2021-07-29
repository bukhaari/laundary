import TextError from "./textError";
import { Field, ErrorMessage } from "formik";
import { FormLabel, makeStyles } from "@material-ui/core";

function BaseTextArea(props) {
  const useStyles = makeStyles({
    error: {
      color: "red",
      marginLeft: "8px",
    },
    textArea: {
      width: "98%",
      padding: "12px",
      fontSize: "17px",
      display: "block",
    },
  });

  const classes = useStyles();

  const { name, label, placeholder } = props;
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Field
        as="textarea"
        placeholder={placeholder}
        name={name}
        className={classes.textArea}
      />
      <ErrorMessage name={name} component={TextError} />
    </>
  );
}

export default BaseTextArea;
