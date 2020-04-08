import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@atlaskit/textfield";
import Highlighter from "../components/Highlighter";
import DatasetList from "../components/DatasetList.js";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import { api } from "../api";
import { defer } from "../utils/async";
import { bool, groupBy, items, nth, sorted } from "../utils/functional";

// TODO: DatasetList
// FIXME: Maybe rename that?

export default props => {
    // This are our state cells
    const prefix = props.match ? props.match.params.prefix : props.prefix;
    const params = new URLSearchParams(props.location.search);
    const query = params.get("q");

    const [datasets, setDatasets] = useState([]);
    const [filter, setFilter] = useState(null);
    const [highlighter, setHighlighter] = useState(null);

    // Loads the list of datasets and converts them in something
    // like `{id,name,description,qualifiedName,group,value}`
    // @input none
    // @output allDatasets
    useEffect(() => {
        // This normalizes the datasets from the data format into the format
        // required by the view.
        api.listDatasets().then(_ =>
            setDatasets(
                Object.entries(_ || {}).map(kv => {
                    const [k, v] = kv;
                    const qualifiedName =
                        (v && v.definition && v.definition.identification) || k;
                    const description =
                        (v && v.definition && v.definition.description) || null;
                    const path = qualifiedName.split(".");
                    const name = nth(path, -1);
                    const group = path[0] || "";
                    return {
                        id: k,
                        name: name,
                        description: description,
                        qualifiedName: qualifiedName,
                        group: group,
                        value: v
                    };
                })
            )
        );
    }, []);

    // @input prefix
    // @input query
    // @output optional predicate to filter and match
    useEffect(
        _ => {
            if (prefix || query) {
                const re_prefix = prefix ? new RegExp("^" + prefix) : null;
                const re_query = query ? new RegExp(query, "i") : null;
                setFilter(_ => _ => {
                    return (
                        (re_prefix ? re_prefix.test(_.id) : true) &&
                        (re_query
                            ? re_query.test(_.id) ||
                              re_query.test(_.description)
                            : true)
                    );
                });
            } else {
                setFilter(null);
            }
        },
        [prefix, query]
    );

    // @input query
    // @output optional regexp to highlight matches
    useEffect(
        _ =>
            query
                ? setHighlighter(new RegExp(query, "i"))
                : setHighlighter(null),
        [query]
    );

    // @render main
    return (
        <div className="DatasetListPage">
            <DatasetList
                items={datasets}
                filter={filter}
                highlight={highlighter}
            />
        </div>
    );
};
