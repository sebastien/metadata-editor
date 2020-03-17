import React, { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import Field from "./editor/Field";

export default function Editor(props) {
  const storage = window.localStorage;
  const storageKey = props.storageKey || "Editor";
  const isReadOnly = props.isReadOnly;
  const root = props.path || "#root";

  const [schema, setSchema] = useState({});
  const [types, setTypes] = useState({});
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
          // We extract the types from the schema, as they can be used
          // later on.
          const [schema, types] = Object.entries(_)
            .reduce(
              (ab, kv) => {
                (kv[0].startsWith("#") ? ab[1] : ab[0]).push(kv);
                return ab;
              },
              [[], []]
            )
            .map(_ => Object.fromEntries(_));
          setTypes(types);
          setSchema(schema);
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
                path={root + "/" + k}
                schema={v}
                types={types}
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
