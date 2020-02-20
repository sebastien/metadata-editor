import React, { useEffect, useState } from "react";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Editor from "../components/Editor";
import { api } from "../api";

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="datasets" key="tdi.views.legalEntities" />
    <BreadcrumbsItem text="tdi.views.legalEntities" key="tdi" />
  </BreadcrumbsStateless>
);

export default props => {
  const datasetFQN = props.dataset || null;
  const [datasetValue, setDatasetValue] = useState(null);

  const [datasetParent, datasetName] = (_ => [
    _.slice(0, -1).join("."),
    _[_.length - 1]
  ])((datasetFQN || "").split("."));

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
      <PageHeader breadcrumbs={breadcrumbs} actions={actions}>
        Metadata for {datasetParent}.{datasetName}
      </PageHeader>
      <Editor schema={props.schema} defaultValue={datasetValue} />
    </div>
  );
};
