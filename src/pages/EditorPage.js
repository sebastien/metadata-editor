import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Editor from "../components/Editor";
import { api } from "../api";

export default props => {
  const datasetFQN = props.dataset || null;
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
  const actions = (
    <ButtonGroup>
      <Button appearance="primary">Rename</Button>
    </ButtonGroup>
  );

  return (
    <div className="EditorPage">
      <PageHeader breadcrumbs={breadcrumbs}>
        Metadata for {datasetParent}.{datasetName}
      </PageHeader>
      <div class="EditorPage-editor">
        <Editor schema={props.schema} defaultValue={datasetValue} />
      </div>
    </div>
  );
};
