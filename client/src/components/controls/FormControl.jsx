import BaseField from "./BaseField";
import BaseBtn from "./BaseBtn";
import RadioBoxGroup from "./RadioBoxGroup";
import BaseCheckBoxField from "./BaseCheckBoxField";
import BaseTextArea from "./BaseTextArea";
import BaseText from "./BaseText";
import BaseRadioBoxField from "./BaseRadioBoxField";
import BaseFieldArray from "./BaseFieldArray";
import BaseCheckBox from "./BaseCheckbox";

function FormikControl({ control, ...rest }) {
  switch (control) {
    case "field":
      return <BaseField {...rest} />;
    case "Button":
      return <BaseBtn {...rest} />;
    case "checkboxField":
      return <BaseCheckBoxField {...rest} />;
    case "checkbox":
      return <BaseCheckBox {...rest} />;
    case "textArea":
      return <BaseTextArea {...rest} />;
    case "typography":
      return <BaseText {...rest} />;
    case "radioField":
      return <BaseRadioBoxField {...rest} />;
    case "radio":
      return <RadioBoxGroup {...rest} />;
    case "fieldArray":
      return <BaseFieldArray {...rest} />;
    // case "select":
    //   return <Select {...rest} />;
    // case "date":
    //   return <DatePicker {...rest} />;
    // case "chakraInput":
    //   return <ChakraInput {...rest} />;
    default:
      return null;
  }
}

export default FormikControl;
