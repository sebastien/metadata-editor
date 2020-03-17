import React from "react";
import Field, { resolveSchema } from "./Field";
import { firstdef } from "../../utils/functional";

export default function Composite(props) {
  const value = props.defaultValue;
  const isReadOnly = props.isReadOnly;
  const types = props.types;
  const schema = props.schema || {};
  const layout = firstdef(props.layout, schema.layout);
  const fields = resolveSchema(props.schema.fields, types);

  return (
    <div className="Composite">
      <ul className="Composite-list" data-layout={layout}>
        {Object.entries(fields || []).map((kv, i) => {
          const [fieldKey, fieldSchema] = kv;
          const fieldValue = value ? value[fieldKey] : undefined;
          return (
            <li className="Composite-list-item" key={i}>
              <Field
                id={fieldKey}
                schema={resolveSchema(fieldSchema, types)}
                types={props.types}
                path={props.path ? props.path + "/" + fieldKey : fieldKey}
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
