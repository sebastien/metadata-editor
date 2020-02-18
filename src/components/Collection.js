import React from "react";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";
import Field from "./Field";

export default function Collection(props) {
  const value = props.defaultValue || [];

  // FIXME: Does not preserve integrity
  const addItem = _ => {
    props.onChange(value.concat([{ key: undefined, value: undefined }]));
  };

  const removeItem = i => {
    const v = value.filter((v, j) => i !== j);
    props.onChange(v, props.id);
  };

  const renameItem = (i, k) => {
    const v = value.map((v, j) => (i === j ? { ...v, key: k } : v));
    props.onChange(v, props.id);
  };

  const setItem = (i, o) => {
    const v = value.map((v, j) => (i === j ? { ...v, value: o } : v));
    props.onChange(v, props.id);
  };

  return (
    <div>
      <ul>
        {value.length === 0 ? (
          <li>Empty</li>
        ) : (
          value.map((item, i) => {
            const k = item.key;
            const v = item.value;
            return (
              <li key={i}>
                <div>
                  <Button onClick={() => removeItem(i)}>Remove</Button>
                </div>
                <InlineEdit
                  editView={fieldProps => (
                    <TextField {...fieldProps} autoFocus defaultValue={k} />
                  )}
                  readView={_ => (k ? <div>{k}</div> : <em>New item</em>)}
                  defaultValue={k}
                  onConfirm={value => {
                    renameItem(i, value);
                  }}
                />

                <div>
                  <Field
                    id={k}
                    schema={props.schema.content}
                    path={props.path ? props.path + "." + k : k}
                    defaultValue={v ? v[k] : undefined}
                    onChange={(w, id) => {
                      const o = { ...v };
                      o[id] = w;
                      setItem(i, o);
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
