import React, { useState, useEffect } from "react";
import AttributeList from "./AttributeList";
import RelationList from "./RelationList";

export default function Concept(props) {
  const [value, setValue] = useState([{}]);
  const name = props.name || "pouet";

  return (
    <div className="Concept">
      <h3>Concept {name}</h3>
      <h4>Attributes</h4>
      <AttributeList />
      <h4>Relations</h4>
      <RelationList />
    </div>
  );
}
