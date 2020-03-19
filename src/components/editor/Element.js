import React from "react";
import { CreatableSelect } from "@atlaskit/select";
import { firstdef } from "../../utils/functional";

const getStyle = _ => ({
  container: (provided, state) => {
    return {
      ...provided,
      borderRadius: 0,
      padding: 0
    };
  },
  indicatorsContainer: (provided, state) => {
    return {
      ...provided,
      height: "auto",
      // TODO: We should make it invisible when not focused, but the state
      // does not seem to work.
      opacity: 0.15,
      padding: 0
    };
  },
  indicatorContainer: (provided, state) => {
    return {
      ...provided,
      height: "auto",
      backgroundColor: "red",
      padding: 0
    };
  },
  control: (provided, state) => {
    return {
      ...provided,
      fontWeight: _ && _.isBold ? 600 : 200,
      borderRadius: 0,
      border: "0px solid transparent",
      minHeight: "0px",
      backgroundColor: "transparent"
    };
  },
  input: (provided, state) => {
    return {
      ...provided,
      padding: 0
    };
  }
});

// const keyStyle = getStyle({ isBold: true });
// const defaultStyle = getStyle();

const formatOptionLabel = option => (
  <div class="Element-option">
    {option.id ? <div class="Element-option-label">{option.label}</div> : null}
    <div class="Element-option-id">{option.id}</div>
    {option.description ? (
      <div class="Element-option-description">{option.description}</div>
    ) : null}
  </div>
);

export default function Element(props) {
  const schema = props.schema || {};
  const options = firstdef(props.options, schema.options);
  return (
    <div className="Element">
      <CreatableSelect
        name="name"
        {...props}
        options={options}
        spacing="compact"
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
}
