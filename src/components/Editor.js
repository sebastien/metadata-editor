import React, { useState, useEffect } from "react";
import Button from "@atlaskit/button";
import Field from "./Field";

export default function Editor(props) {
  const storage = window.localStorage;
  const storageKey = props.storageKey || "Editor";

  const [schema, setSchema] = useState({});
  const [value, setValue] = useState(
    props.defaultValue || JSON.parse(storage.getItem(storageKey) || "{}")
  );

  console.log("Editor initial value", value);

  // FIXME: This does not quite work
  const clear = () => {
    storage.setItem(storageKey, "{}");
    setValue({});
  };

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
                defaultValue={value[k]}
                onChange={v => {
                  const res = { ...value };
                  res[k] = v;
                  setValue(res);
                  console.log("Editor.value=", res);
                  storage.setItem(storageKey, JSON.stringify(res));
                }}
              />
            );
          })}
        </div>
        <div className="Editor-content-actions">
          <Button onClick={clear}>Clear</Button>
        </div>
      </section>
      <aside className="Editor-sidebar">asdas</aside>
    </div>
  );
}
