import { StylesConfig } from "react-select";

export const selectStyles = (
  lg: boolean,
  isInvalid: boolean,
  tags: boolean,
  sm: boolean,
  rounded: boolean
): StylesConfig => ({
  control: (provided, state) => ({
    ...provided,
    borderRadius: rounded ? ".375rem" : 0,
    padding: lg ? ".5rem 1rem" : sm ? "0.25rem .5rem" : ".25rem .75rem",
    boxShadow: lg
      ? state.isFocused
        ? "0 3px 5px rgb(0,0,0,0.03)"
        : "0 3px 5px rgb(0,0,0,0.03)"
      : state.isFocused
      ? 0
      : 0,
    borderColor: isInvalid
      ? state.isFocused
        ? "#d32929"
        : "#d32929"
      : state.isFocused
      ? "#2e51bb"
      : "#e2e8f0",
    transition: "border-color .25s ease-in-out",
    fontSize: sm ? ".75rem" : ".875rem",
    minHeight: "1px",
    "&:hover": {
      borderColor: isInvalid
        ? state.isFocused
          ? "#d32929"
          : "#d32929"
        : state.isFocused
        ? "#2e51bb"
        : "#e2e8f0",
    },
  }),
  input: (provided) => ({
    ...provided,
    paddingTop: sm ? 0 : "2px",
    paddingBottom: sm ? 0 : "2px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#a0aec0",
  }),
  valueContainer: (provided) => ({
    ...provided,
    lineHeight: 1.15,
    padding: "0px",
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 250ms";

    return { ...provided, opacity, transition };
  },
  indicatorSeparator: () => ({
    width: "5px",
    height: "100%",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: "0px",
    transform: state.isFocused ? "rotate(180deg)" : "rotate(0deg)",
    color: state.isFocused ? "#000000" : "#000000",
    "&:hover": {
      color: state.isFocused ? "#000000" : "#000000",
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    padding: "0px",
    color: state.isFocused ? "#929292" : "#929292",
    transition: "color .15s ease-in-out",
    "&:hover": {
      color: state.isFocused ? "#000000" : "#000000",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    background: tags ? "transparent" : "#e2e8f0",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    padding: tags ? "0" : "3px",
    paddingLeft: tags ? "0" : "6px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderLeftWidth: tags ? "0" : "1px",
    borderLeftColor: "#cbd5e0",
    borderRadius: 0,
    marginLeft: tags ? "0" : ".25rem",
    "&:hover": {
      background: tags ? "transparent" : "#d6dce4",
      color: "#000000",
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: ".5rem",
    boxShadow: "0 3px 10px rgb(0, 0, 0, 0.09)",
    border: 0,
    borderRadius: rounded ? ".375rem" : 0,
    zIndex: 9,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: ".5rem",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected
      ? "#2d3748"
      : state.isFocused
      ? "#2d3748"
      : "#2d3748",
    backgroundColor: state.isSelected
      ? "#f1f5f8"
      : state.isFocused
      ? "#f1f5f8"
      : "#FFFFFF",
    ":active": {
      backgroundColor: state.isSelected
        ? "#f1f5f8"
        : state.isFocused
        ? "#f1f5f8"
        : "#FFFFFF",
    },
    padding: ".5rem",
    borderRadius: rounded ? ".375rem" : 0,
    transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
    transitionDuration: ".3s",
    transitionProperty:
      "background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter",
    cursor: "pointer",
    opacity: state.isDisabled ? 0.4 : 1,
  }),
  group: (provided) => ({
    ...provided,
    padding: 0,
    margin: 0,
    "&:first-of-type": {
      marginTop: "-.5rem",
    },
  }),
  groupHeading: (provided) => ({
    ...provided,
    padding: ".5rem",
    paddingBottom: ".25rem",
    margin: 0,
    color: "#a0aec0",
    fontSize: "11px",
  }),
});
