import React, { useState, useEffect } from "react";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import { idem } from "../../utils/functional";

const PADDING_PER_LEVEL = 16;

export default function Hierarchy(props) {
    const [tree, setTree] = useState({
        rootId: "#root",
        items: {
            "#root": { id: "#root", children: [], data: { label: "Root" } }
        }
    });

    useEffect(
        _ =>
            setTree(
                [
                    "Concept/Currency",
                    "Concept/Holiday+Schedule",
                    "Concept/Rounding#Currency",
                    "Concept/Spot#Currency",
                    "Concept/DeltaGamma",
                    "Concept/Deal#Findur",
                    "Concept/FX+Delta",
                    "Concept/FX+Gamma",
                    "Concept/FX+Rate",
                    "Concept/Instrument",
                    "Concept/Event+Close",
                    "Concept/Event+Open",
                    "Concept/Event+Tracking",
                    "Concept/Delivery",
                    "Entity/FINDUR",
                    "Entity/Govt.USD",
                    "Entity/Govt.NZD",
                    "Entity/Swap.USD",
                    "Entity/Swap.EUR",
                    "Entity/EUR/USD_BasisSwap.EUR"
                ].reduce(
                    (tree, path) => {
                        var node = tree.items["#root"];
                        path.split("/").forEach(id => {
                            const next = (tree.items[id] = tree.items[id] || {
                                id: id,
                                children: [],
                                data: { label: id }
                            });
                            if (node.children.indexOf(next.id) === -1) {
                                node.children.push(id);
                            }
                            node = next;
                        });
                        return tree;
                    },
                    { ...tree }
                )
            ),
        // FIXME: We should put tree.revision or something like that. If we
        // put just the tree, this will loop.
        []
    );

    const onExpand = itemId => {
        setTree(mutateTree(tree, itemId, { isExpanded: true }));
    };

    const onCollapse = itemId => {
        setTree(mutateTree(tree, itemId, { isExpanded: false }));
    };

    const onToggle = item => {
        item.isExpanded ? onCollapse(item.id) : onExpand(item.id);
    };

    const onDragEnd = (source, destination) => {
        if (!destination) {
            return;
        }
        const newTree = moveItemOnTree(tree, source, destination);
        // this.setState({
        //   tree: newTree
        // });
    };

    const renderItem = ({ item, onExpand, onCollapse, provided }) => {
        return (
            <div
                className={
                    "Hierarchy-item" +
                    (item.data && item.data.type ? " as-" + item.data.type : "")
                }
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <div
                    className="Hierarchy-item-icon"
                    data-type={item.type || (item.data && item.data.type)}
                    onClick={() => onToggle(item)}
                    data-state={
                        (item.isExpanded ? "expanded" : "") +
                        (item.children && item.children.length
                            ? "notempty"
                            : " empty")
                    }
                />

                {(props.wrapItem || idem)(
                    <div
                        className="Hierarchy-item-label"
                        onClick={_ =>
                            props.onSelect ? props.onSelect(item, _) : null
                        }
                    >
                        {item.data ? item.data.label : item.id}
                    </div>,
                    item
                )}
            </div>
        );
    };

    return (
        <div className="Hierarchy">
            <Tree
                tree={tree}
                renderItem={renderItem}
                onExpand={onExpand}
                onCollapse={onCollapse}
                onDragEnd={onDragEnd}
                offsetPerLevel={PADDING_PER_LEVEL}
                isDragEnabled={true}
            />
        </div>
    );
}
