import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";
import Highlighter from "./Highlighter";
import { api } from "../api";

export default props => {
    const highlight = props.highlight
        ? _ => <Highlighter query={props.highlight} text={_} />
        : _ => _;
    return (
        <Link className="DatasetItem" to={api.linkToDataset(props.id)}>
            <div className="DatasetItem-header">
                <div className="DatasetItem-icon">{Icons.Dataset}</div>
                <div className="DatasetItem-heading">
                    <div className="DatasetItem-label">
                        {highlight(props.id)}
                    </div>
                    <div className="DatasetItem-meta">
                        10 fields, 1000 records
                    </div>
                </div>
            </div>
            <div className="DatasetItem-description">
                {highlight(props.description)}
            </div>
        </Link>
    );
};
