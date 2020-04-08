import React, { useEffect, useState } from "react";
import DatasetItem from "./DatasetItem";
import Icons from "./Icons";
import { sorted } from "../utils/functional";

export default props => {
    const filter = props.filter;
    const items = props.items;
    const sortCriteria = props.sort || (_ => _.id);
    const sortedItems = sorted(items, sortCriteria);
    const filteredItems = filter ? sortedItems.filter(filter) : sortedItems;
    const highlight = props.highlight;
    const isEmpty = items.length && filteredItems.length == 0;

    return (
        <div className="DatasetList">
            <div className="DatasetList-header">
                {filteredItems.length != items.length
                    ? filteredItems.length + "/" + items.length
                    : "" + filteredItems.length}{" "}
                elements
            </div>
            {isEmpty ? (
                <div className="DatasetList-empty">
                    <div className="DatasetList-empty-content">
                        <div className="DatasetList-empty-icon">
                            {Icons.DatCat}
                        </div>
                        <div className="DatasetList-empty-message">
                            Sorry, I did not find any match for your query…
                        </div>
                    </div>
                </div>
            ) : (
                <div className="DatasetList-content">
                    <ul className="DatasetList-items">
                        {filteredItems.map((v, i) => (
                            <li className="DatasetList-item" key={i}>
                                <DatasetItem highlight={highlight} {...v} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
