import React, { useState } from "react";
import { CreatableSelect } from "@atlaskit/select";

const components = {
  DropdownIndicator: null
};

const createOption = label => ({
  label,
  value: label
});

export default function MultiLineSearchInput(props) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState([]);

  const handleChange = (value, actionMeta) => {
    setValue(value);
  };

  const handleInputChange = inputValue => {
    setInputValue(inputValue);
  };

  const handleKeyDown = event => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setInputValue("");
        setValue([...value, createOption(inputValue)]);
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder="Type something and press enter..."
      value={value}
    />
  );
}
