import React from "react";
import InlineEdit from "@atlaskit/inline-edit";
import TextField from "@atlaskit/textfield";
import TextArea from "@atlaskit/textarea";
import Select from "@atlaskit/select";
import Tag from "@atlaskit/tag";
import Group from "@atlaskit/tag-group";
import Composite from "./Composite";
import Section from "./Section";
import Collection from "./Collection";

function FieldEditorFactory(props, defaultValue) {
  const type = props.schema ? props.schema.type : null;
  switch (type) {
    case "label":
      return fieldProps => {
        return (
          <TextField {...fieldProps} autoFocus defaultValue={defaultValue} />
        );
      };
    case "text":
      return fieldProps => (
        <TextArea {...fieldProps} autoFocus defaultValue={defaultValue} />
      );
    case "select":
      return fieldProps => (
        <Select
          {...fieldProps}
          options={props.schema ? props.schema.options : null}
          defaultValue={defaultValue || []}
          isMulti
          openMenuOnFocus
          autoFocus
        />
      );
    default:
      return props => "Unsupported type:" + type;
  }
}

function FieldViewFactory(props, defaultValue) {
  const type = props.schema ? props.schema.type : null;
  if (defaultValue === null || defaultValue === undefined) {
    return props => <Tag text="Empty" />;
  } else {
    switch (type) {
      case "label":
        return props => (
          <span className="Field-value__label">{"" + defaultValue}</span>
        );
      case "text":
        return props => (
          <span className="Field-value__text">{"" + defaultValue}</span>
        );
      case "select":
        return props =>
          !defaultValue || defaultValue.length === 0 ? (
            <span>Empty</span>
          ) : (
            <Group>
              {(defaultValue || []).map((v, k) => (
                // TODO: We should map the label to the options, ie. normalise the values
                <Tag text={v.label} key={k} />
              ))}
            </Group>
          );
      default:
        return props => "Unsupported type:" + type;
    }
  }
}

// The field is a generic component that acts as a nexus for picking the right
// component based on the field type.
export default function Field(props) {
  // The value of the field
  const defaultValue = props.defaultValue;
  const type = props.schema.type;

  // If it's a section, things are much simpler, we just display a label,
  // and then iterate.
  // NOTE: We might want to abstract the section component if it becomes more
  // complex.
  if (type === "section") {
    // TODO: Abstract away as component
    return <Section {...props} />;
  } else if (type === "composite") {
    return <Composite {...props} />;
  } else if (type === "collection") {
    return <Collection {...props} />;
  } else {
    // We store the type as we're going to use it quite often.
    if (props.mode === "read") {
      return FieldViewFactory(props, defaultValue);
    } else if (props.mode === "edit") {
      return FieldEditorFactory(props, defaultValue);
    } else {
      // This picks the edit and read views for the field based on its
      // type.
      const editView = FieldEditorFactory(props, defaultValue);
      const readView = FieldViewFactory(props, defaultValue);

      return (
        <InlineEdit
          label={props.hasLabel !== false ? props.id : undefined}
          editView={editView}
          readView={readView}
          defaultValue={defaultValue}
          onConfirm={value => {
            // This propagates the changes up the chain
            props.onChange(value, props.id);
          }}
        />
      );
    }
  }
}
