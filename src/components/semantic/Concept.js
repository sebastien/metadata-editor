import React, { useState } from "react";
import Editor from "../Editor";
import { SKOS, RDFS } from "../../model/semantic";

const schema = {
  id: { label: "Id", type: "label", mode: "edit" },
  label: { label: "Label", type: "label", mode: "edit" },
  description: { label: "Description", type: "text", mode: "edit" },
  attributes: {
    label: "Attributes",
    type: "list",
    style: "grid",
    content: {
      type: "composite",
      layout: "horizontal",
      fields: {
        name: {
          type: "element",
          mode: "edit",
          options: SKOS.getTerms().concat(RDFS.getTerms()),
          placeholder: "name"
        },
        equals: {
          type: "separator",
          label: "="
        },
        value: {
          type: "label",
          mode: "edit",
          placeholder: "value"
        },
        as: {
          type: "separator",
          label: "as"
        },
        variant: {
          type: "label",
          mode: "edit",
          placeholder: "variant"
        }
      }
    }
  }
};

export default function Concept(props) {
  const [value, setValue] = useState([{}]);
  const name = props.name || "pouet";

  return (
    <div className="Concept">
      <Editor schema={schema} />
    </div>
  );
}
