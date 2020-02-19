import React from "react";
import PageHeader from "@atlaskit/page-header";
import SmartQueryInput from "../components/SmartQueryInput";

export default props => {
  return (
    <div className="CataloguePage">
      <PageHeader>Data Catalogue</PageHeader>
      <SmartQueryInput />
    </div>
  );
};
