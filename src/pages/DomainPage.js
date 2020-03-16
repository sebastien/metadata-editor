import React, { useState } from "react";
import PageHeader from "@atlaskit/page-header";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Hierarchy from "../components/semantic/Hierarchy";
import Concept from "../components/semantic/Concept";

export default function DomainPage(props) {
  const [selected, setSelected] = useState(undefined);
  const onItemSelect = item => {
    setSelected(item.id);
  };

  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Domain" href="#/domain" key="0" />
      {selected ? (
        <BreadcrumbsItem
          text={selected.id}
          href={`#/domain/${selected.id}`}
          key="1"
        />
      ) : null}
    </BreadcrumbsStateless>
  );

  return (
    <div className="DomainPage">
      <PageHeader breadcrumbs={breadcrumbs}>Domain Page</PageHeader>
      <div className="DomainPage-body">
        <div className="DomainPage-body-tree">
          <Hierarchy onSelect={onItemSelect} />
        </div>
        <div className="DomainPage-body-detail">
          <Concept name={selected} />
        </div>
      </div>
    </div>
  );
}
