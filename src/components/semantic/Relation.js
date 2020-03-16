import React from "react";
import Remove from "@atlaskit/icon/glyph/editor/remove";
import { CreatableSelect } from "@atlaskit/select";
import Button from "@atlaskit/button";
import { SKOS, RDFS } from "../../model/semantic";

export default function(props) {
  const onSetValue = (value, action, key) =>
    props.onChange ? props.onChange(value, action, key) : null;
  return (
    <div className="SemanticRelation">
      <div className="SemanticAttribute-name">
        <CreatableSelect
          name="name"
          value={props.value && props.value.name}
          placeholder="Enter property"
          isClearable={true}
          onChange={(v, a) => onSetValue(v, a, "name")}
        />
      </div>
      <div className="SemanticRelation-object">
        <CreatableSelect
          name="object"
          value={props.value && props.value.object}
          placeholder="Enter value"
          isClearable={true}
          onChange={(v, a) => onSetValue(v, a, "object")}
        />
      </div>
      <div className="SemanticRelation-value">
        <CreatableSelect
          name="value"
          defaultValue={props.value && props.value.value}
          placeholder="Enter qualifier"
          isClearable={true}
          onChange={(v, a) => onSetValue(v, a, "value")}
        />
      </div>
      <div className="SemanticRelation-actions">
        <Button
          appearance="subtle"
          onClick={props.onRemove}
          iconBefore={<Remove label="remove item" />}
        />
      </div>
    </div>
  );
}
