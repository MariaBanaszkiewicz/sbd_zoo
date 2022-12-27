import React, { forwardRef, InputHTMLAttributes, LegacyRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Icon } from "@chakra-ui/react";
import { Calendar } from "react-feather";

const DateInput = ({
  disabled = false,
  readOnly = false,
  ...rest
}: DatePicker): JSX.Element => {
  const CustomInput = forwardRef(
    (
      { value, onClick, onChange }: InputHTMLAttributes<HTMLInputElement>,
      ref: LegacyRef<HTMLInputElement>
    ) => (
      <Flex
        onClick={disabled || readOnly ? undefined : onClick}
        w="100%"
        bg={disabled ? "green.100" : "white"}
        className={disabled || readOnly ? "readonly" : ""}
      >
        <Icon as={Calendar} color="green.600" ml={3} mr={5} />
        <input
          className="react-datapicker__input-text"
          type="text"
          ref={ref}
          value={value}
          readOnly={disabled || readOnly}
          onChange={onChange}
        />
      </Flex>
    )
  );

  CustomInput.displayName = "DateInput";

  return (
    <DatePicker
      locale={"pl"}
      customInput={<CustomInput />}
      dateFormat="dd/MM/yyyy"
      className="test-disabled"
      {...rest}
    />
  );
};

export default DateInput;
