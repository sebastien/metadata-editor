import React from "react";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";
import Field from "./Field";

function copyItems(items) {
  const res = {};
  for (const k in items) {
    res[k] = items[k];
  }
  return res;
}

export default function Collection(props) {
  const value = props.defaultValue || {};

  // FIXME: Does not preserve integrity
  const addItem = _ => {
    const v = copyItems(value);
    const n = Object.keys(value).length;
    // TODO: Should check that the key does not exist yet
    v["XXXXXXXXX" + n * 10000] = {};
    props.onChange(v, props.id);
  };

  const removeItem = k => {
    const v = copyItems(value);
    //TODO: Should check that the key is defined
    delete v[k];
    props.onChange(v, props.id);
  };

  const renameItem = (k, kk) => {
    const v = copyItems(value);
    v[kk] = v[k];
    delete v[k];
    props.onChange(v, props.id);
  };

  const setItem = (k, o) => {
    const v = copyItems(value);
    v[k] = o;
    props.onChange(v, props.id);
  };

  const items = Object.entries(value || {});

  console.log("FIELD", items, "form", value);
  return (
    <div>
      <ul>
        {items.length === 0 ? (
          <li>Empty</li>
        ) : (
          items.map((kv, i) => {
            const [k, v] = kv;
            console.log("Item #", i, "@", k, "=", v, "in", kv);
            return (
              <li key={i}>
                <div>
                  <Button onClick={() => removeItem(k)}>Remove</Button>
                </div>
                <InlineEdit
                  editView={fieldProps => (
                    <TextField {...fieldProps} autoFocus defaultValue={k} />
                  )}
                  readView={_ => <div>{k}</div>}
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
