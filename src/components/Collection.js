import React, { useState } from "react";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";
import Field from "./Field";

export default function Collection(props) {
  const [value, setValue] = useState(props.defaultValue || {});

  // FIXME: Does not preserve integrity
  const addItem = _ => {
    const v = { ...value };
    const n = Object.keys(value).length;
    // TODO: Should check that the key does not exist yet
    v[n] = {};
    setValue(v);
    props.onChange(v, props.id);
  };

  const removeItem = k => {
    const v = { ...value };
    //TODO: Should check that the key is defined
    delete v[k];
    setValue(v);
    props.onChange(v, props.id);
  };

  const renameItem = (k, kk) => {
    const v = { ...value };
    v[kk] = k;
    delete v[k];
    setValue(v);
    props.onChange(v, props.id);
  };

  const setItem = (k, o) => {
    const v = { ...value };
    v[k] = o;
    setValue(v);
    props.onChange(v, props.id);
  };

  const items = Object.entries(value || {});

  return (
    <div>
      <ul>
        {items.length == 0 ? (
          <li>Empty</li>
        ) : (
          items.map((kv, i) => {
            const [k, v] = kv;
            return (
              <li key={k}>
                <div>
                  <Button onClick={() => removeItem(k)}>Remove</Button>
                </div>
                <InlineEdit
                  editView={fieldProps => (
                    <TextField {...fieldProps} autoFocus defaultValue={k} />
                  )}
                  readView={_ => <div>{"key:" + k}</div>}
                  defaultValue={k}
                  onConfirm={value => {
                    renameItem(k, value);
                  }}
                />

                <div>
                  <Field
                    id={k}
                    schema={props.schema.content}
                    path={props.path ? props.path + "." + k : k}
                    defaultValue={v ? v[k] : undefined}
                    onChange={(w, id) => {
                      // This propagates the changes up the chain
                      console.log("Collection change", k, "of", v, "to", w);
                      const o = { ...v };
                      o[id] = w;
                      setItem(k, o);
                    }}
                  />
                </div>
              </li>
            );
          })
        )}
      </ul>
      <Button onClick={addItem}>Add</Button>
    </div>
  );
}
