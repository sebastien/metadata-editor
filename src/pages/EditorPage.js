import React from "react";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Button, { ButtonGroup } from "@atlaskit/button";
import PageHeader from "@atlaskit/page-header";
import Editor from "../components/Editor";

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="datasets" key="tdi.views.legalEntities" />
    <BreadcrumbsItem text="tdi.views.legalEntities" key="tdi" />
  </BreadcrumbsStateless>
);

export default props => {
  const pageParent = "tdi.views";
  const pageName = "legalEntities";

  const actions = (
    <ButtonGroup>
      <Button appearance="primary">Rename</Button>
    </ButtonGroup>
  );

  return (
    <div className="EditorPage">
      <PageHeader breadcrumbs={breadcrumbs} actions={actions}>
        Metadata for {pageParent}.{pageName}
      </PageHeader>
      <Editor schema={props.schema} />
    </div>
  );
};
