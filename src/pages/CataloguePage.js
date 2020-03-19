import React, { useEffect, useState } from "react";
import PageHeader from "@atlaskit/page-header";
import { Link } from "react-router-dom";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
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
    // This normalizes the datasets from the data format into the format
    // required by the view.
    api.listDatasets().then(_ =>
      setDatasets(
        Object.entries(_ || {}).map(kv => {
          const [k, v] = kv;
          return {
            key: k,
            name: (v && v.definition && v.definition.identification) || k,
            description: v && v.definition && v.definition.description
          };
        })
      )
    );
  }, []);

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
        {(datasets || []).map((d, i) =>
          !props.prefix || prefixRe.test(d.name) ? (
            <DatasetItem {...d} key={d.key} />
          ) : (
            undefined
          )
        )}
      </ul>
    </div>
  );
};
