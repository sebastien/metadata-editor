import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@atlaskit/page-header";
import { BreadcrumbsStateless, BreadcrumbsItem } from "@atlaskit/breadcrumbs";
import InlineEdit from "@atlaskit/inline-edit";
import TextField from "@atlaskit/textfield";
import Hierarchy from "../components/semantic/Hierarchy";
import Concept from "../components/semantic/Concept";
import { STORE } from "../model/semantic";

export const DomainView = {
    id: "domain/home",
    type: "container",
    getItems: () => [
        {
            type: "HeaderSection",
            id: "domain/home:header",
            items: [
                {
                    id: "domain-hierarchy",
                    type: "InlineComponent",
                    component: Hierarchy,
                    wrapItem: (children, item) => (
                        <Link to={"/domain/" + item.id}>{children}</Link>
                    )
                }
            ]
        }
    ]
};

export default function DomainPage(props) {
    const concept = props.concept ? STORE.ensureConcept(props.concept) : null;
    const breadcrumbs = (
        <BreadcrumbsStateless>
            <BreadcrumbsItem text="Domain" href="#/domain" key="0" />
            {concept ? (
                <BreadcrumbsItem
                    text={concept.id}
                    href={`#/domain/${concept.id}`}
                    key="1"
                />
            ) : null}
        </BreadcrumbsStateless>
    );

    const onUpdateId = event => {
        console.log("Concept id updated", event);
    };
    const onConceptChange = event => {
        console.log("On concept changes", event);
    };
    return (
        <div className="DomainPage">
            {concept ? (
                <Fragment>
                    <PageHeader breadcrumbs={breadcrumbs}>
                        Concept
                        <div className="Concept-id">
                            <InlineEdit
                                value={concept.id}
                                onConfirm={onUpdateId}
                                editView={fieldProps => (
                                    <TextField
                                        {...fieldProps}
                                        autoFocus
                                        defaultValue={concept.id}
                                        placeholder={concept.id}
                                    />
                                )}
                                readView={_ => (
                                    <span className="Concept-id-label">
                                        {concept.id}
                                    </span>
                                )}
                            />
                        </div>
                    </PageHeader>
                    <div className="DomainPage-body">
                        <div className="DomainPage-body-detail">
                            <Concept
                                concept={props.concept}
                                onChange={onConceptChange}
                            />
                        </div>
                    </div>
                </Fragment>
            ) : null}
        </div>
    );
}
