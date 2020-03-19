import React, { useState } from "react";
import Button from "@atlaskit/button";
import ChevronLeft from "@atlaskit/icon/glyph/chevron-left";
import ChevronDown from "@atlaskit/icon/glyph/chevron-down";
import Composite from "./Composite";

export default function Section(props) {
  const [visible, setVisible] = useState(true);
  const toggleVisibility = () => {
    setVisible(visible ? false : true);
  };
  return (
    <section className="Section">
      <header className="Section-header">
        <h1 className="Section-header-title">
          {props.schema.label || props.id}
        </h1>
        <Button
          onClick={() => toggleVisibility()}
          appearance="subtle"
          iconBefore={
            visible ? (
              <ChevronDown label="Close section" />
            ) : (
              <ChevronLeft label="Open section" />
            )
          }
        />
      </header>
      {visible ? (
        <div className="Section-body">
          <Composite {...props} />{" "}
        </div>
      ) : (
        undefined
      )}
    </section>
  );
}
