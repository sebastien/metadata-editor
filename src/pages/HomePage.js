import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import SmartQuery from "../components/SmartQuery";
import Icons from "../components/Icons";

export default function(props) {
    return (
        <div className="HomePage">
            <div className="HomePage-icon">{Icons.DatCat}</div>
        </div>
    );
}
