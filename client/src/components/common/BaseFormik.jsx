import { Formik, Form } from "formik";

function BaseFormik({ children, ...props }) {
  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={props.validationSchema}
      onSubmit={props.onSubmit}
    >
      <Form>{children}</Form>
    </Formik>
  );
}

export default BaseFormik;
