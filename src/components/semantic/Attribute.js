import React from "react";
import Remove from "@atlaskit/icon/glyph/editor/remove";
import { CreatableSelect } from "@atlaskit/select";
import Button from "@atlaskit/button";
import { SKOS, RDFS } from "../../model/semantic";

const options = SKOS.getTerms().concat(RDFS.getTerms());

// TODO: Attribute should have a type, and based on that we will pick which editor we will
// use. It could be numeric, it could be a label, it could be a text. We also need to support
// qualifiers and moving.

// TODO: We should probably support the structural editor part as well with a schema.

const formatOptionLabel = _ => (
    <div className="SemanticAttribute-item">
        <div className="SemanticAttribute-item-label">{_.label}</div>
        {_.description ? (
            <div className="SemanticAttribute-item-description">
                {_.description}
            </div>
        ) : null}
    </div>
);

const getStyle = _ => ({
    container: (provided, state) => {
        return {
            ...provided,
            borderRadius: 0,
            padding: 0
        };
    },
    indicatorsContainer: (provided, state) => {
        return {
            ...provided,
            height: "auto",
            // TODO: We should make it invisible when not focused, but the state
            // does not seem to work.
            opacity: 0.15,
            padding: 0
        };
    },
    indicatorContainer: (provided, state) => {
        return {
            ...provided,
            height: "auto",
            backgroundColor: "red",
            padding: 0
        };
    },
    control: (provided, state) => {
        return {
            ...provided,
            fontWeight: _ && _.isBold ? 600 : 200,
            borderRadius: 0,
            border: "0px solid transparent",
            minHeight: "0px",
            backgroundColor: "transparent"
        };
    },
    input: (provided, state) => {
        return {
            ...provided,
            padding: 0
        };
    }
});

const keyStyle = getStyle({ isBold: true });
const defaultStyle = getStyle();

export default function(props) {
    const onSetValue = (value, action, key) => {
        props.onChange ? props.onChange(value, action, key) : null;
    };
    return (
        <div className="SemanticAttribute">
            <div className="SemanticAttribute-name">
                <CreatableSelect
                    name="name"
                    styles={keyStyle}
                    value={props.value && props.value.name}
                    placeholder="Enter property"
                    formatOptionLabel={formatOptionLabel}
                    options={options}
                    isClearable={true}
                    onChange={(v, a) => onSetValue(v, a, "name")}
                />
            </div>
            <div className="SemanticAttribute-sep">=</div>
            <div className="SemanticAttribute-value">
                <CreatableSelect
                    name="object"
                    styles={defaultStyle}
                    value={props.value && props.value.value}
                    placeholder="Enter value"
                    formatOptionLabel={formatOptionLabel}
                    isClearable={true}
                    options={options}
                    onChange={(v, a) => onSetValue(v, a, "value")}
                />
            </div>
            <div className="SemanticAttribute-sep">as</div>
            <div className="SemanticAttribute-qualifier">
                <CreatableSelect
                    name="value"
                    styles={defaultStyle}
                    defaultValue={props.value && props.value.qualifier}
                    placeholder="Enter qualifier"
                    formatOptionLabel={formatOptionLabel}
                    isClearable={true}
                    options={options}
                    onChange={(v, a) => onSetValue(v, a, "qualifier")}
                />
            </div>
            <div className="SemanticAttribute-actions">
                <Button
                    appearance="subtle"
                    onClick={props.onRemove}
                    iconBefore={<Remove label="remove item" />}
                />
            </div>
        </div>
    );
}
