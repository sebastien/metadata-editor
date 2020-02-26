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
import { assert } from "../utils";

/**
 * Ensures that the given schema (either an object or string) is
 * returned as an object. If it is a string, it will be resolved
 * from the given types collection.
 * @param {E} schema
 * @param {*} types
 */
export function resolveSchema(schema, types) {
  if (typeof schema === "string") {
    assert(types, "No types given but schema is a string", schema);
    assert(
      types[schema],
      "Mising type defininition",
      schema,
      "in types",
      types
    );
    return types[schema];
  } else {
    return schema;
  }
}

function FieldEditorFactory(props, defaultValue) {
  const schema = props.schema || {};
  const type = schema.type;
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
          options={schema.options}
          defaultValue={defaultValue}
          isMulti={schema.multiple}
          openMenuOnFocus
          autoFocus
        />
      );
    default:
      return props => "Unsupported type:" + type;
  }
}

function FieldViewFactory(props, defaultValue) {
  const schema = props.schema || {};
  const type = schema.type;
  if (defaultValue === null || defaultValue === undefined) {
    return props => <Tag text="Empty" />;
  } else {
    switch (type) {
      case "label":
        return fieldProps => (
          <span className="Field-value__label">{"" + defaultValue}</span>
        );
      case "text":
        return fieldProps => (
          <span className="Field-value__text">{"" + defaultValue}</span>
        );
      case "select":
        return fieldProps =>
          !defaultValue || defaultValue.length === 0 ? (
            <Tag text="Empty" />
          ) : schema.multiple ? (
            <Group>
              {(defaultValue || []).map((v, k) => (
                <Tag text={v.label} key={k} />
              ))}
            </Group>
          ) : (
            <Tag text={defaultValue.label} />
          );
      default:
        return fieldProps => "Unsupported type:" + type;
    }
  }
}

// The field is a generic component that acts as a nexus for picking the right
// component based on the field type.
export default function Field(props) {
  // The value of the field
  const defaultValue = props.defaultValue;
  const schema = props.schema || {};
  const type = schema.type;
  const isReadOnly = props.isReadOnly;

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
    if (props.mode === "read" || isReadOnly) {
      return (
        <div className="Field" data-state="readonly">
          <div className="Field-label">{schema.label || props.id}</div>
          {FieldViewFactory(props, defaultValue)(props)}
        </div>
      );
    } else if (props.mode === "edit") {
      return FieldEditorFactory(props, defaultValue)(props);
    } else {
      // This picks the edit and read views for the field based on its
      // type.
      const editView = FieldEditorFactory(props, defaultValue);
      const readView = FieldViewFactory(props, defaultValue);

      return (
        <InlineEdit
          label={
            props.hasLabel !== false ? schema.label || props.id : undefined
          }
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
