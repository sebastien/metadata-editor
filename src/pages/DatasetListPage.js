import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "@atlaskit/page-header";
import { Link } from "react-router-dom";
import TextField from "@atlaskit/textfield";
import Highlighter from "../components/Highlighter";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import { api } from "../api";
import { defer } from "../utils/async";
import { bool, groupBy, items, nth, sorted } from "../utils/functional";

// TODO: DatasetList
// FIXME: Maybe rename that?

export default props => {
    // This are our state cells
    const prefix = props.match ? props.match.params.prefix : props.prefix;
    const [allDatasets, setAllDatasets] = useState([]);
    const [filteredDatasets, setFilteredDatasets] = useState([]);
    const [groupedDatasets, setGroupedDatasets] = useState([]);
    // The query part of the datasets is a bit complex because we need
    // to create the query string form the prefix and the current
    // query while also creating a regexp that is going to be reused
    // for highlighting.
    const [query, setQuery] = useState(null);
    const [queryFilter, setQueryFilter] = useState(null);
    const [queryRegexp, setQueryRegexp] = useState(null);
    const [queryFilterFunction, setQueryFilterFunction] = useState(null);
    const deferredInput = useState(defer(100))[0];

    // Loads the list of datasets and converts them in something
    // like `{id,name,description,qualifiedName,group,value}`
    // @input none
    // @output allDatasets
    useEffect(() => {
        // This normalizes the datasets from the data format into the format
        // required by the view.
        api.listDatasets().then(_ =>
            setAllDatasets(
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

    // Filters all the datasets using the filter function
    // @input queryFilterFunction
    // @output filteredDatasets
    useEffect(
        _ => {
            setFilteredDatasets(
                // We pre-sort all the datasets, so the groups will
                // also be sorted in the same way.
                sorted(
                    queryFilterFunction
                        ? allDatasets.filter(queryFilterFunction.predicate)
                        : allDatasets,
                    _ => _.id
                )
            );
        },
        [allDatasets, queryFilterFunction]
    );

    // Groups the datasets together
    // @input filteredDatasets
    // @output groupedDatasets
    useEffect(() => {
        setGroupedDatasets(
            sorted(
                items(groupBy(filteredDatasets, _ => (_ ? _.group : ""))),
                _ => _[0]
            )
        );
    }, [filteredDatasets]);

    // Sets the query filter function once the queryFilter has changed
    // (when the user selects the search button)
    // @input prefix
    // @input queryFilter
    // @output queryRegexp
    useEffect(() => {
        if (queryFilter) {
            setQueryRegexp(queryFilter ? new RegExp(queryFilter, "i") : null);
        } else {
            setQueryRegexp(null);
        }
    }, [prefix, queryFilter]);

    // Sets the query filter function once the queryFilter has changed
    // (when the user selects the search button)
    // @input queryFilter
    // @output queryFilterFunction
    useEffect(() => {
        if (prefix || queryFilter) {
            // NOTE: This is similar to the queryRegexp but here we do a whole
            // string matc.
            const qs =
                prefix || queryFilter
                    ? (prefix ? "^" + prefix : "") +
                      (queryFilter ? ".*" + queryFilter + ".*" : "")
                    : null;
            const re = new RegExp(qs, "i");
            const predicate = _ =>
                re.test(_.id) || re.test(_.label) || re.test(_.description);
            setQueryFilterFunction({ predicate: predicate });
        } else {
            setQueryFilterFunction(null);
        }
    }, [prefix, queryFilter]);

    // @render Breadcrumbs
    const breadcrumbs = (
        <BreadcrumbsStateless>
            <BreadcrumbsItem
                text="Datasets"
                href={`#${api.linkToDatasets()}`}
                key="0"
            />
            {props.prefix ? (
                <BreadcrumbsItem
                    text={props.prefix}
                    href={`#${api.linkToDatasets(props.prefix)}`}
                    key="1"
                />
            ) : null}
        </BreadcrumbsStateless>
    );

    // @render List of datasets
    const renderList = l => (
        <ul className="DatasetList">
            {(l || []).map((d, i) =>
                d ? (
                    <li
                        className="DatasetItem"
                        key={d.id}
                        data-metadata={bool(d.value)}
                    >
                        <Link
                            className="DatasetItem-link"
                            to={api.linkToDataset(d.id)}
                        >
                            <div className="DatasetItem-label">
                                {d.qualifiedName && queryRegexp ? (
                                    <Highlighter
                                        text={d.qualifiedName}
                                        query={queryRegexp}
                                    />
                                ) : (
                                    d.qualifiedName
                                )}
                            </div>
                            <div className="DatasetItem-description">
                                {d.description && queryRegexp ? (
                                    <Highlighter
                                        text={d.description}
                                        query={queryRegexp}
                                    />
                                ) : (
                                    d.description
                                )}
                            </div>
                        </Link>
                    </li>
                ) : null
            )}
        </ul>
    );

    // @render Groups of datasets
    const renderGroup = group => (
        <li key={group[0] || "*"} className="DatasetGroup">
            {group[0] ? (
                <Link
                    className="DatasetGroup-label"
                    to={api.linkToDatasets(group[0])}
                >
                    {group[0]}
                </Link>
            ) : null}
            {renderList(group[1])}
        </li>
    );

    // @render main
    return (
        <div className="DatasetListPage">
            {breadcrumbs}
            <div className="DatasetListPage-search">
                <TextField
                    autoFocus
                    placeholder="Search for data"
                    defaultValue={query}
                    onChange={event => {
                        const q = event.target.value;
                        setQuery(q);
                        deferredInput.push(_ => setQueryFilter(q));
                    }}
                />
            </div>

            {groupedDatasets.length <= 1 ? (
                renderList(filteredDatasets)
            ) : (
                <ul className="DatasetGroup-list">
                    {groupedDatasets.map(renderGroup)}
                </ul>
            )}
        </div>
    );
};
