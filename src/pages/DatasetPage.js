import React, { useEffect, useState } from "react";
import Button, { ButtonGroup } from "@atlaskit/button";
import Icons from "../components/Icons";
import Tabs from "@atlaskit/tabs";
import Tag from "@atlaskit/tag";
import Editor from "../components/Editor";
import TablePreview from "../components/preview/TablePreview";

import { api } from "../api";

export default props => {
    // @options
    const datasetId = props.match ? props.match.params.dataset : props.dataset;
    const [datasetParent, datasetName] = (_ => [
        _.slice(0, -1).join("."),
        _[_.length - 1]
    ])((datasetId || "").split("."));
    const schemaURL = props.schema || api.linkToDatasetSchema();

    // @cells
    const [isReadOnly, setReadOnly] = useState(true);
    const [value, setValue] = useState(undefined);
    const [schema, setSchema] = useState({});
    const [types, setTypes] = useState({});
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [datasetValue, setDatasetValue] = useState(null);

    // @action SaveChanges
    const doSaveChanges = (id, value) => {
        if (value) {
            api.saveDatasetMetaData(id, value);
        }
    };

    // @effect (datasetId) → datasetValue
    // Loads the dataset metadata
    useEffect(
        _ => {
            datasetId
                ? api.getDatasetMetaData(datasetId).then(setDatasetValue)
                : setDatasetValue({});
        },
        [datasetId]
    );

    // @effect (schemaURL) → (types,schema)
    // Loads the overall metadata schema and types, this is used to configure
    // the editor.
    useEffect(() => {
        async function fetchData() {
            fetch(schemaURL)
                .then(_ => {
                    return _.json();
                })
                .then(_ => {
                    // We extract the types from the schema, as they can be used
                    // later on.
                    const [schema, types] = Object.entries(_)
                        .reduce(
                            (ab, kv) => {
                                (kv[0].startsWith("#") ? ab[1] : ab[0]).push(
                                    kv
                                );
                                return ab;
                            },
                            [[], []]
                        )
                        .map(_ => Object.fromEntries(_));
                    setTypes(types);
                    setSchema(schema);
                });
        }
        fetchData();
    }, [schemaURL]);

    // @render Page header actions
    const actions = isReadOnly ? (
        <ButtonGroup>
            <Button
                appearance="primary"
                onClick={_ => {
                    setReadOnly(false);
                }}
            >
                Edit
            </Button>
        </ButtonGroup>
    ) : (
        <ButtonGroup>
            <Button
                appearance="primary"
                onClick={_ => {
                    doSaveChanges(datasetId, value);
                    setReadOnly(true);
                }}
            >
                Save
            </Button>
            <Button
                appearance="subtle"
                onClick={_ => {
                    setReadOnly(true);
                }}
            >
                Cancel
            </Button>
        </ButtonGroup>
    );

    // @render Metadata tab content
    const metadataContent = (
        <div className="DatasetPage-editor">
            <Editor
                schema={schema}
                types={types}
                path={datasetId}
                defaultValue={datasetValue}
                isReadOnly={isReadOnly}
                onChange={_ => setValue(_)}
            />
        </div>
    );

    // @render Data tab content
    const dataContent = <TablePreview dataset={datasetId} limit={100} />;

    return (
        <div className="DatasetPage ContentPage">
            <div className="ContentPage-header">
                <div
                    className="ContentPage-header-icon"
                    title="Relational Table"
                >
                    {Icons.Dataset}
                </div>
                <div className="ContentPage-header-heading">
                    <h1 className="ContentPage-header-title">{datasetId}</h1>
                    <h2 className="ContentPage-header-subtitle">
                        4 columns, 2000 rows
                    </h2>
                </div>
                <div className="ContentPage-header-actions">{actions}</div>
            </div>
            <div className="ContentPage-body">{metadataContent}</div>
        </div>
    );
};
