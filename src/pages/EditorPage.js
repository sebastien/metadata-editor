import React, { useEffect, useState } from "react";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Editor from "../components/Editor";
import { api } from "../api";

const save = (id, value) => {
  console.log("SAVING", id, value);
  if (value) {
    api.saveDataset(id, value);
  }
};

export default props => {
  const datasetFQN = props.dataset || null;
  const [isReadOnly, setReadOnly] = useState(true);
  const [value, setValue] = useState(undefined);

  const [datasetValue, setDatasetValue] = useState(null);

  const [datasetParent, datasetName] = (_ => [
    _.slice(0, -1).join("."),
    _[_.length - 1]
  ])((datasetFQN || "").split("."));

  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="datasets" href="#/catalogue" key="datasets" />
      <BreadcrumbsItem
        text={datasetParent}
        href={`#/catalogue/${datasetParent}`}
        key="parent"
      />
    </BreadcrumbsStateless>
  );

  useEffect(
    _ => {
      datasetFQN
        ? api.getDataset(datasetFQN).then(setDatasetValue)
        : setDatasetValue({});
    },
    [datasetFQN]
  );
  const actions = isReadOnly ? (
    <ButtonGroup>
      <Button
        appearance="primary"
        onClick={_ => {
          setReadOnly(false);
        }}
      >
        Edit
      </Button>
    </ButtonGroup>
  ) : (
    <ButtonGroup>
      <Button
        appearance="primary"
        onClick={_ => {
          save(datasetFQN, value);
          setReadOnly(true);
        }}
      >
        Save
      </Button>
      <Button
        appearance="subtle"
        onClick={_ => {
          setReadOnly(true);
        }}
      >
        Cancel
      </Button>
    </ButtonGroup>
  );

  return (
    <div className="EditorPage">
      <PageHeader breadcrumbs={breadcrumbs} actions={actions}>
        Metadata for {datasetParent}.{datasetName}
      </PageHeader>
      <div className="EditorPage-editor">
        <Editor
          schema={props.schema}
          defaultValue={datasetValue}
          isReadOnly={isReadOnly}
          onChange={_ => setValue(_)}
        />
      </div>
    </div>
  );
};
