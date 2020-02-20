import React, { useEffect, useState } from "react";
import PageHeader from "@atlaskit/page-header";
import { Link } from "react-router-dom";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import { ObjectResult, ResultItemGroup } from "@atlaskit/quick-search";
import SmartQueryInput from "../components/SmartQueryInput";
import { api } from "../api";

const DatasetItem = props => {
  return (
    <li className="DatasetItem">
      <Link className="DatasetItem-link" to={"/editor/" + props.name}>
        <div className="DatasetItem-label">{props.name}</div>
        <div className="DatasetItem-description">{props.description}</div>
      </Link>
    </li>
  );
};

export default props => {
  const [datasets, setDatasets] = useState([]);
  const prefixRe = props.prefix ? new RegExp("^" + props.prefix) : null;
  useEffect(() => {
    api.listDatasets().then(setDatasets);
  }, [true]);

  const breadcrumbs = props.prefix ? (
    <BreadcrumbsStateless>
      <BreadcrumbsItem text="All datasets" href="#/catalogue" key="0" />
      <BreadcrumbsItem
        text={props.prefix}
        href={`#/catalogue/${props.prefix}`}
        key="1"
      />
    </BreadcrumbsStateless>
  ) : null;

  return (
    <div className="CataloguePage">
      <PageHeader breadcrumbs={breadcrumbs}>Data Catalogue</PageHeader>
      <ul className="DatasetList">
        {datasets.map((v, i) =>
          !props.prefix || prefixRe.test(v.name) ? (
            <DatasetItem {...v} key={i} />
          ) : (
            undefined
          )
        )}
      </ul>
    </div>
  );
};
