import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { selectStyles } from "../../utils/selectStyles";

const animatedComponents = makeAnimated();

const SelectAdvanced = React.forwardRef(
  (
    {
      readOnly = false,
      lg = false,
      isInvalid = false,
      tags = false,
      sm = false,
      rounded = true,
      ...rest
    }: {
      readOnly?: boolean;
      lg?: boolean;
      isInvalid?: boolean;
      tags?: boolean;
      sm?: boolean;
      rounded?: boolean;
      [x: string]: unknown;
    },
    ref
  ): Select => {
    return (
      <Select
        isClearable
        styles={selectStyles(lg, isInvalid, tags, sm, rounded)}
        placeholder="Wybierz..."
        isSearchable={!readOnly}
        menuIsOpen={readOnly ? false : undefined}
        noOptionsMessage={() => "Brak dostępnych opcji"}
        components={animatedComponents}
        ref={ref}
        {...rest}
      />
    );
  }
);

SelectAdvanced.displayName = "SelectAdvanced";

export default SelectAdvanced;
