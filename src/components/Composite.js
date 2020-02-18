import React, { useState } from "react";
import Field from "./Field";
import assert from "../assert";
import Add from "@atlaskit/icon/glyph/editor/add";

export default function Composite(props) {
  const [visible, setVisible] = useState(true);
  const value = props.defaultValue;
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
