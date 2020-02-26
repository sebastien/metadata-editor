import React from "react";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";
import Tag from "@atlaskit/tag";
import Field, { resolveSchema } from "./Field";

// SEE: https://atlaskit.atlassian.com/packages/core/icon/example/icon-explorer
import Remove from "@atlaskit/icon/glyph/editor/remove";
import Add from "@atlaskit/icon/glyph/editor/add";
import Up from "@atlaskit/icon/glyph/arrow-up";
import Down from "@atlaskit/icon/glyph/arrow-down";
import { assert } from "../utils";

export default function Collection(props) {
  const value = props.defaultValue || [];
  const schema = props.schema;
  const contentSchema = resolveSchema(schema.children, props.types);

  const isReadOnly = props.isReadOnly;

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

  const moveUp = i => {
    if (i > 0) {
      const v = value.slice(0, i - 1);
      v.push(value[i]);
      v.push(value[i - 1]);
      props.onChange(v.concat(value.slice(i + 1)), props.id);
    }
  };

  const moveDown = i => {
    if (i < value.length - 1) {
      const v = value.slice(0, i);
      v.push(value[i + 1]);
      v.push(value[i]);
      props.onChange(v.concat(value.slice(i + 2)), props.id);
    }
  };

  return (
    <div className="Collection">
      {props.label ? (
        <div className="Collection-label">{props.label}</div>
      ) : null}
      <ul className="Collection-list">
        {value.length === 0 ? (
          <li>
            <Tag text="Empty" />
          </li>
        ) : (
          value.map((item, i) => {
            const k = item.key;
            const v = item.value;
            return (
              <li className="Collection-list-item" key={i}>
                <div className="Collection-list-item-header">
                  <div className="Collection-list-item-header-tag">
                    <Tag text={schema.itemLabel || "Item"} color="grey" />
                  </div>
                  <div className="Collection-list-item-header-key">
                    {isReadOnly ? (
                      <span className="Collection-list-item-header-key-label">
                        {k}
                      </span>
                    ) : (
                      <InlineEdit
                        editView={fieldProps => (
                          <TextField
                            {...fieldProps}
                            autoFocus
                            defaultValue={k}
                          />
                        )}
                        readView={_ =>
                          k ? (
                            <span className="Collection-list-item-header-key-label">
                              {k}
                            </span>
                          ) : (
                            <em className="Collection-list-item-header-key-placeholder">
                              New item
                            </em>
                          )
                        }
                        defaultValue={k}
                        onConfirm={value => {
                          renameItem(i, value);
                        }}
                      />
                    )}
                  </div>
                  {isReadOnly ? null : (
                    <div className="Collection-list-item-header-actions">
                      {i > 0 ? (
                        <Button
                          onClick={() => moveUp(i)}
                          appearance="subtle"
                          iconBefore={<Up label="move item up" />}
                        />
                      ) : (
                        undefined
                      )}
                      {i < value.length - 1 ? (
                        <Button
                          onClick={() => moveDown(i)}
                          appearance="subtle"
                          iconBefore={<Down label="move item down" />}
                        />
                      ) : (
                        undefined
                      )}
                      <Button
                        onClick={() => removeItem(i)}
                        appearance="subtle"
                        iconBefore={<Remove label="remove item" />}
                      />
                    </div>
                  )}
                </div>
                <div className="Collection-list-item-body">
                  <Field
                    id={i}
                    path={props.path ? props.path + "." + i : i}
                    schema={contentSchema}
                    types={props.types}
                    isReadOnly={isReadOnly}
                    defaultValue={v}
                    onChange={(w, id) => {
                      setItem(i, Object.assign({ ...v }, w));
                    }}
                  />
                </div>
              </li>
            );
          })
        )}
      </ul>
      {isReadOnly ? null : (
        <div className="Collection-creator">
          <Button
            onClick={addItem}
            appearance="primary"
            iconBefore={<Add label="add item" />}
          >
            Add item
          </Button>
        </div>
      )}
    </div>
  );
}
