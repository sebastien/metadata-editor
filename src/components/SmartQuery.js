import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Icons from "./Icons";
import { api } from "../api";
import { slice, merge } from "../utils/functional";
import { plural } from "../utils/text";
import { defer } from "../utils/async";

const RE_EMPTY = new RegExp("^\\s*$");

const QueryFilter = props => {
    const title =
        props.type +
        (props.prefix ? "/" + props.prefix : "") +
        (props.match ? ":" + props.match : "");
    return (
        <Link className="SmartQuery-filter" to={props.parent} title={title}>
            {props.type === "keyword" ? (
                <span className="SmartQuery-filter-icon">{Icons.Search}</span>
            ) : (
                <span className="SmartQuery-filter-label">{props.type}</span>
            )}
            {props.prefix ? (
                <span className="SmartQuery-filter-value" data-type="prefix">
                    {props.prefix}
                </span>
            ) : props.match ? (
                <span className="SmartQuery-filter-value" data-type="match">
                    {props.match}
                </span>
            ) : null}
            <button className="SmartQuery-filter-action">{Icons.Remove}</button>
        </Link>
    );
};

/**
 * @function Parses a query string and returns a list of filters.
 * The query format is a primary path (<type>/<prefix/id>)
 */
function parseQuery(query) {
    const [type, prefix] = (query || "").split("/");
    const filters = [];
    // We make sure the parent is a collection
    const parent = prefix ? "/" + plural(type) : "/";
    if (type) {
        filters.push(
            // If it's a plural form, we consider it a query, otherwise
            // it's a match.
            merge(
                { parent: parent },
                type.endsWith("s")
                    ? { type: type, prefix: prefix }
                    : { type: type, match: prefix }
            )
        );
    }
    return filters;
}

function formatQuery(filters, keyword) {
    return (
        "/" +
        (filters
            .map(_ =>
                _.query || _.match
                    ? _.type + "/" + (_.query || _.match)
                    : _.type
            )
            .join("/") +
            (keyword ? "?q=" + encodeURIComponent(keyword) : ""))
    );
}

function refineSearchFor(type) {
    switch (type) {
        case "dataset":
            return "fields";
        default:
            return plural(type);
    }
}

export default props => {
    const queryString = props.match ? props.match.params.query : "";
    const params = new URLSearchParams(
        props.location ? props.location.search : window.location.search
    );
    const query = params.get("q") || "";
    const filters = parseQuery(queryString);
    const [redirect, redirectTo] = useState(null);
    const [deferredInput] = useState(defer(100));
    const searchFor =
        filters.length && filters[0]
            ? refineSearchFor(filters[0].type)
            : "the catalogue";
    // That's how we support rediraction on input change
    useEffect(_ => redirectTo(null), [redirect]);

    // @handler When the search input changes, we redirect to
    // change the URL -- ie. the state is stored in the URL
    const onInputQuery = value => {
        if (value !== params.get("q")) {
            redirectTo(formatQuery(filters, value));
        }
    };

    const isEmpty = RE_EMPTY.test(query);
    // We don't show the input if we have an exact match, for now.
    const hasInput = !(filters.length && filters[0].match);

    return (
        <div
            className="SmartQuery"
            data-state={filters.length ? "filters" : "no-filters"}
        >
            <div className="SmartQuery-filters">
                {filters.map((v, i) => (
                    <QueryFilter {...v} key={i} />
                ))}
            </div>
            <div
                className="SmartQuery-input"
                data-state={
                    (isEmpty ? "empty" : "not-empty") +
                    (hasInput ? " input" : " no-input")
                }
            >
                {isEmpty ? undefined : Icons.Search}
                <input
                    className="SmartQuery-input-field"
                    type="search"
                    value={query}
                    placeholder={`Search ${searchFor}…`}
                    onChange={_ => onInputQuery(_.target.value)}
                />
                {isEmpty ? (
                    undefined
                ) : (
                    <button
                        className="SmartQuery-input-action"
                        onClick={_ => onInputQuery("")}
                    >
                        {Icons.Remove}
                    </button>
                )}
                {redirect ? <Redirect to={redirect} /> : null}
            </div>
        </div>
    );
};
