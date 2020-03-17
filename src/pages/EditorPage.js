import React, { useEffect, useState } from "react";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Tag from "@atlaskit/tag";
import Editor from "../components/Editor";

import { api } from "../api";

const save = (id, value) => {
  if (value) {
    api.saveDatasetMetaData(id, value);
  }
};

export default props => {
  const datasetId = props.dataset || null;
  const [isReadOnly, setReadOnly] = useState(true);
  const [value, setValue] = useState(undefined);
  const [schema, setSchema] = useState(props.schem);
  const [types, setTypes] = useState({});

  const [datasetValue, setDatasetValue] = useState(null);

  const [datasetParent, datasetName] = (_ => [
    _.slice(0, -1).join("."),
    _[_.length - 1]
  ])((datasetId || "").split("."));

  const schema_url = props.schema || "schema.json";
  useEffect(() => {
    async function fetchData() {
      fetch(schema_url)
        .then(_ => {
          return _.json();
        })
        .then(_ => {
          // We extract the types from the schema, as they can be used
          // later on.
          const [schema, types] = Object.entries(_)
            .reduce(
              (ab, kv) => {
                (kv[0].startsWith("#") ? ab[1] : ab[0]).push(kv);
                return ab;
              },
              [[], []]
            )
            .map(_ => Object.fromEntries(_));
          setTypes(types);
          setSchema(schema);
        });
    }
    fetchData();
  }, [schema_url]);

  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="datasets" href="#/datasets" key="datasets" />
      <BreadcrumbsItem
        text={datasetParent}
        href={`#/datasets/${datasetParent}`}
        key="parent"
      />
    </BreadcrumbsStateless>
  );

  useEffect(
    _ => {
      datasetId
        ? api.getDatasetMetaData(datasetId).then(setDatasetValue)
        : setDatasetValue({});
    },
    [datasetId]
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
          save(datasetId, value);
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

  // FIXME: Hardcoding!
  const content = (
    <div className="EditorPage-links">
      <div>
        <Tag text="Data" color="yellow" />
        <Tag
          text="CSV"
          color="standard"
          href={`//appdev62/dataset/${datasetId}/preview/:data:csv`}
        />
        <Tag
          text="JSON"
          color="standard"
          href={`//appdev62/dataset/${datasetId}/preview/:data:json`}
        />
        <Tag text="Metadata" color="yellow" />
        <Tag
          text="JSON"
          color="standard"
          href={`//appdev62/dataset/${datasetId}:meta:json`}
        />
      </div>
    </div>
  );

  return (
    <div className="EditorPage">
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actions}
        bottomBar={content}
      >
        Metadata for {datasetParent}.{datasetName}
      </PageHeader>
      <div className="EditorPage-editor">
        <Editor
          schema={props.schema}
          types={props.types}
          path={datasetId}
          defaultValue={datasetValue}
          isReadOnly={isReadOnly}
          onChange={_ => setValue(_)}
        />
      </div>
    </div>
  );
};
