import React, { useState } from "react";
import Editor from "../Editor";
import { SKOS, RDFS } from "../../model/semantic";
import { STORE } from "../../model/semantic";

const schema = {
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
    const concept = props.concept ? STORE.ensureConcept(props.concept) : null;

    const onChange = data => {
        if (!concept) {
            return false;
        }
        concept.is(data.label);
        concept.as(data.label);
        (data.attributes || []).forEach((_, i) => {
            const { key, value } = _;
            console.log("Attribute", key, value, i, "FROM", _);
        });
    };

    return (
        <div className="Concept">
            <Editor schema={schema} onChange={onChange} />
        </div>
    );
}
