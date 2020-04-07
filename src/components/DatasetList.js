import React, { useEffect, useState } from "react";
import DatasetItem from "./DatasetItem";

export default props => {
    const filter = props.filter;
    const items = props.items;
    const filteredItems = filter ? items.filter(filter) : items;
    const highlight = props.highlight;
    console.log("FILTER", filter, items.length, "/", filteredItems.lenght);

    return (
        <div className="DatasetList">
            <div className="DatasetList-header">
                {"" + filteredItems.length} elements
            </div>
            <ul className="DatasetList-items">
                {filteredItems.map((v, i) => (
                    <li className="DatasetList-item" key={i}>
                        <DatasetItem highlight={highlight} {...v} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
