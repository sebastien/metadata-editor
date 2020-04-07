import React from "react";
import Button from "@atlaskit/button";
import TextField from "@atlaskit/textfield";
import InlineEdit from "@atlaskit/inline-edit";
import Tag from "@atlaskit/tag";
import Field, { resolveSchema } from "./Field";
import { list, firstdef } from "../../utils/functional";
import { assert } from "../../utils/assert";
import Icons from "../Icons";

// SEE: https://atlaskit.atlassian.com/packages/core/icon/example/icon-explorer
import Remove from "@atlaskit/icon/glyph/editor/remove";
import Add from "@atlaskit/icon/glyph/editor/add";
import Up from "@atlaskit/icon/glyph/arrow-up";
import Down from "@atlaskit/icon/glyph/arrow-down";

export default function Collection(props) {
    const value = props.defaultValue ? list(props.defaultValue) : [];
    assert(
        value instanceof Array,
        "Default value should be an array, got",
        value
    );
    const schema = props.schema;
    const label = firstdef(props.label, schema.label);
    const type = firstdef(props.type, schema.type);
    const style = firstdef(props.style, schema.style);
    const contentSchema = resolveSchema(schema.content, props.types);
    const isList = type === "list";

    const isReadOnly = props.isReadOnly;

    // FIXME: Does not preserve integrity
    const addItem = _ => {
        props.onChange(
            value.concat([isList ? {} : { key: undefined, value: undefined }])
        );
    };

    const removeItem = i => {
        const v = value.filter((v, j) => i !== j);
        props.onChange(v, props.id);
    };

    const renameItem = (i, k) => {
        if (!isList) {
            const v = value.map((v, j) => (i === j ? { ...v, key: k } : v));
            props.onChange(v, props.id);
        }
    };

    const setItem = (i, o) => {
        if (isList) {
            const v = [].concat(value);
            while (v.length <= i) {
                v.push({});
            }
            v[i] = o;
            props.onChange(v, props.id);
        } else {
            const v = value.map((v, j) => (i === j ? { ...v, value: o } : v));
            props.onChange(v, props.id);
        }
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
        <div className="Collection" data-type={type} data-style={style}>
            {label ? <div className="Collection-label">{label}</div> : null}
            <ul className="Collection-list">
                {value.length === 0 ? (
                    <li>
                        <Tag text="Empty" />
                    </li>
                ) : (
                    value.map((item, i) => {
                        const k = isList ? i : item.key;
                        const v = isList ? item : item.value;
                        return (
                            <li className="Collection-item" key={i}>
                                <div className="Collection-item-header">
                                    <div className="Collection-item-header-icon">
                                        {Icons.Field}
                                    </div>
                                    <div className="Collection-item-header-key">
                                        {isReadOnly ? (
                                            <span className="Collection-item-header-key-label">
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
                                                        <span className="Collection-item-header-key-label">
                                                            {k}
                                                        </span>
                                                    ) : (
                                                        <em className="Collection-item-header-key-placeholder">
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
                                        <div className="Collection-item-header-actions">
                                            <Button
                                                onClick={() => moveUp(i)}
                                                isDisabled={i === 0}
                                                appearance="subtle"
                                                iconBefore={
                                                    <Up label="move item up" />
                                                }
                                            />
                                            <Button
                                                onClick={() => moveDown(i)}
                                                isDisabled={
                                                    i === value.length - 1
                                                }
                                                appearance="subtle"
                                                iconBefore={
                                                    <Down label="move item down" />
                                                }
                                            />
                                            <Button
                                                onClick={() => removeItem(i)}
                                                appearance="subtle"
                                                iconBefore={
                                                    <Remove label="remove item" />
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="Collection-item-body">
                                    <Field
                                        id={k}
                                        path={
                                            props.path
                                                ? props.path + "/" + k
                                                : k
                                        }
                                        schema={contentSchema}
                                        types={props.types}
                                        isReadOnly={isReadOnly}
                                        defaultValue={v}
                                        onChange={(w, id) => {
                                            setItem(
                                                i,
                                                Object.assign({ ...v }, w)
                                            );
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
