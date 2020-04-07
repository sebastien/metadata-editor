import React, { useEffect, useState } from "react";
import DatasetItem from "./DatasetItem";

export default props => {
    const prefixFilter = props.prefix
        ? new RegExp("^" + props.prefix, "i")
        : null;
    const queryFilter = props.query ? new RegExp(props.query, "i") : null;
    const items = props.items;
    return (
        <div className="DatasetList">
            <div className="DatasetList-header">
                {"" + items.length} elements
            </div>
            <ul className="DatasetList-items">
                {items.map((v, i) => (
                    <li className="DatasetList-item" key={i}>
                        <DatasetItem {...v} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
