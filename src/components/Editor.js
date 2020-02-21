import React, { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import Field from "./Field";

export default function Editor(props) {
  const storage = window.localStorage;
  const storageKey = props.storageKey || "Editor";
  const isReadOnly = props.isReadOnly;

  const [schema, setSchema] = useState({});
  const [value, setValue] = useState(props.defaultValue || {});

  // FIXME: This does not quite work
  const clear = () => {
    storage.setItem(storageKey, "{}");
    setValue({});
  };
  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  const schema_url = props.schema || "schema.json";
  useEffect(() => {
    async function fetchData() {
      fetch(schema_url)
        .then(_ => {
          return _.json();
        })
        .then(_ => {
          setSchema(_);
        });
    }
    fetchData();
  }, [schema_url]);

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
                path={k}
                schema={v}
                isReadOnly={isReadOnly}
                defaultValue={value ? value[k] : undefined}
                onChange={v => {
                  const res = { ...value };
                  res[k] = v;
                  setValue(res);
                  storage.setItem(storageKey, JSON.stringify(res));
                  props.onChange(res);
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
