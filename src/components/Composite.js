import React from "react";
import Field from "./Field";

export default function Composite(props) {
  const value = props.defaultValue;
  const isReadOnly = props.isReadOnly;

  return (
    <div className="Composite">
      <ul className="Composite-list">
        {Object.entries(props.schema.children || []).map((kv, i) => {
          const [fieldKey, fieldSchema] = kv;
          const fieldValue = value ? value[fieldKey] : undefined;
          return (
            <li className="Composite-list-item" key={i}>
              <Field
                id={fieldKey}
                schema={fieldSchema}
                path={props.path ? props.path + "." + fieldKey : fieldKey}
                isReadOnly={isReadOnly}
                defaultValue={fieldValue}
                onChange={(v, key) => {
                  const updated_value = value ? { ...value } : {};
                  updated_value[fieldKey] = v;
                  props.onChange(updated_value, props.id);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
