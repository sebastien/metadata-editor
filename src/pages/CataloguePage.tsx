import React, { useEffect, useState } from "react";
import PageHeader from "@atlaskit/page-header";
import { Link } from "react-router-dom";
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
  useEffect(() => {
    api.listDatasets().then(setDatasets);
  }, [true]);
  console.log("datasets", datasets);
  return (
    <div className="CataloguePage">
      <PageHeader>Data Catalogue</PageHeader>
      <SmartQueryInput />
      <ul className="DatasetList">
        {datasets.map((v, i) => (
          <DatasetItem {...v} key={i} />
        ))}
      </ul>
      >
    </div>
  );
};
