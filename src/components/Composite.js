import React from "react";
import Field from "./Field";
import assert from "../assert";

export default function Composite(props) {
  const value = props.defaultValue;
  return (
    <div>
      <ul>
        {Object.entries(props.schema.children || []).map((kv, i) => {
          const [fieldKey, fieldSchema] = kv;
          const fieldValue = value ? value[fieldKey] : undefined;
          return (
            <li key={i}>
              <Field
                id={fieldKey}
                schema={fieldSchema}
                path={props.path ? props.path + "." + fieldKey : fieldKey}
                defaultValue={fieldValue}
                onChange={(v, key) => {
                  const updated_value = value ? { ...value } : {};
                  updated_value[fieldKey] = v;
                  assert(
                    fieldKey === key,
                    `Field key "${fieldKey}" is different from value key "${key}"`
                  );
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
