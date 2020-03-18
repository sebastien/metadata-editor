import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@atlaskit/page-header";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import Hierarchy from "../components/semantic/Hierarchy";
import Concept from "../components/semantic/Concept";
import { SemanticStore } from "../model/semantic";

export const DomainView = {
  id: "domain/home",
  type: "container",
  getItems: () => [
    {
      type: "HeaderSection",
      id: "domain/home:header",
      items: [
        {
          id: "domain-hierarchy",
          type: "InlineComponent",
          component: Hierarchy,
          wrapItem: (children, item) => (
            <Link to={"/domain/" + item.id}>{children}</Link>
          )
        }
      ]
    }
  ]
};

export default function DomainPage(props) {
  const breadcrumbs = (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="Domain" href="#/domain" key="0" />
      {concept ? (
        <BreadcrumbsItem
          text={concept.id}
          href={`#/domain/${concept.id}`}
          key="1"
        />
      ) : null}
    </BreadcrumbsStateless>
  );

  return (
    <div className="DomainPage">
      <PageHeader breadcrumbs={breadcrumbs}> Concept {concept.id}</PageHeader>
      <div className="DomainPage-body">
        {/*<div className="DomainPage-body-tree">
          <Hierarchy onSelect={onItemSelect} />
  </div>*/}
        <div className="DomainPage-body-detail">
          <Concept id={concept} />
        </div>
      </div>
    </div>
  );
}
