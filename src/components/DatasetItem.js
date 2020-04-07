import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";
import { api } from "../api";

export default props => {
    return (
        <Link className="DatasetItem" to={api.linkToDataset(props.id)}>
            <div className="DatasetItem-header">
                <div className="DatasetItem-icon">{Icons.Dataset}</div>
                <div className="DatasetItem-heading">
                    <div className="DatasetItem-label">{props.id}</div>
                    <div className="DatasetItem-meta">
                        10 fields, 1000 records
                    </div>
                </div>
            </div>
            <div className="DatasetItem-description">{props.description}</div>
        </Link>
    );
};
