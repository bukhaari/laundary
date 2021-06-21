import { useReducer, useEffect } from "react";

const reducerRule = (state, { type, payload }) => {
  switch (type) {
    case "SET-VALUE":
      return { ...state, values: { ...state.values, ...payload } };
    case "SET-TOUCH":
      return { ...state, visited: { ...state.visited, ...payload } };
    case "SET-TOUCH-BULK":
      return { ...state, visited: { ...payload } };
    case "SET-RULES":
      return { ...state, rules: { ...state.rules, ...payload } };
    case "SET-ERROR":
      return { ...state, errors: { ...state.errors, ...payload } };
    case "CLEAR":
      return { ...state, values: payload, visited: {} };
    case "RESET":
      return { ...state, visited: {} };
    default:
      return [];
  }
};

export const useRules = (props) => {
  const [state, dispatch] = useReducer(reducerRule, {
    values: props.data,
    errors: {},
    visited: {},
    rules: {},
  });
  useEffect(() => {
    Object.keys(state.values).forEach((key) => {
      onError(key)();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.values]);

  const handleChange = (field) => (e) => {
    if (typeof e.persist === "function") {
      e.persist();
      handleBlur(field)();
    }
    let value = e;
    if (e.target) value = e.target.value;
    // if (e.target && e.target.value) value = e.target.value;
    dispatch({
      type: "SET-VALUE",
      payload: { [field]: value },
    });
  };
  const onError = (field) => (rules = state.rules[field] || []) => {
    // console.log(state.rules["branchCash"]);
    for (let index = 0; index < rules.length; index++) {
      if (typeof rules[index] === "function") {
        let errMsg = rules[index](state.values[field], field);
        if (typeof errMsg === "function") errMsg = errMsg();
        if (errMsg === true) {
          dispatch({ type: "SET-ERROR", payload: { [field]: false } });
        } else {
          dispatch({ type: "SET-ERROR", payload: { [field]: errMsg } });

          break;
        }
      } else throw new Error("every rule must be function");
    }
  };
  const setRule = (rules, field) => {
    if (!Array.isArray(rules)) throw new Error("Rules must be an array");
    dispatch({ type: "SET-RULES", payload: { [field]: rules } });
    onError(field)(rules);
  };
  const handleBlur = (field) => () => {
    dispatch({ type: "SET-TOUCH", payload: { [field]: true } });
    onError(field)();
  };
  const isValid = () => {
    let touch = {};
    Object.keys(state.values).forEach((key) => {
      touch[key] = true;
    });
    dispatch({ type: "SET-TOUCH-BULK", payload: touch });
    return !Object.keys(state.errors).some((error) => !!state.errors[error]);
  };
  const clear = (data = {}) => {
    if (Array.isArray(data) || typeof data !== "object")
      throw new Error(
        `clear(${data}) prams of ${
          Array.isArray(data) ? "Array" : typeof data
        } not allowed`
      );

    dispatch({ type: "RESET" });
    dispatch({ type: "CLEAR", payload: { ...props.data, ...data } });
  };
  const reset = () => {
    dispatch({ type: "RESET" });
  };
  const propsData = (fieldName) => ({
    value: state.values[fieldName],
    onChange: handleChange(fieldName),
    onBlur: handleBlur(fieldName),
    setRule,
    name: fieldName,
    error: !!state.errors[fieldName] && state.visited[fieldName],
    helperText: state.visited[fieldName] && state.errors[fieldName],
    // trim: () => console.log("trim"),
  });
  const bindProps = (val) => propsData(val);

  const data = { isValid, clear, resetValidation: reset, values: state.values };

  return { bindProps, data };
};
