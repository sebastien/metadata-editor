import React, { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import Field from "./editor/Field";

export default function Editor(props) {
  const storage = window.localStorage;
  const schema = props.schema;
  const types = props.types;
  const storageKey = props.storageKey || "Editor";
  const isReadOnly = props.isReadOnly;
  const root = props.path || "#root";

  const [value, setValue] = useState(props.defaultValue || {});

  // FIXME: This does not quite work
  const clear = () => {
    storage.setItem(storageKey, "{}");
    setValue({});
  };
  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  return (
    <div className="Editor">
      <section className="Editor-content">
        <div className="Editor-content-fields">
          {Object.entries(schema).map((kv, i) => {
            const [k, v] = kv;
            return (
              <Field
                key={i}
                id={k}
                path={root + "/" + k}
                schema={v}
                types={types}
                isReadOnly={isReadOnly}
                defaultValue={value ? value[k] : undefined}
                onChange={v => {
                  const res = { ...value };
                  res[k] = v;
                  setValue(res);
                  if (props.persist) {
                    storage.setItem(storageKey, JSON.stringify(res));
                  }
                  props && props.onChange && props.onChange(res);
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "none" }} className="Editor-content-actions">
          <Button onClick={clear}>Clear</Button>
        </div>
      </section>
      <aside className="Editor-sidebar" />
    </div>
  );
}
