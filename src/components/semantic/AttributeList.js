import React, { useState, useEffect } from "react";
import CollectionBehaviour from "../behavior/Collection";
import Attribute from "./Attribute";
import {
  list,
  setnth,
  merge,
  dict,
  last,
  isEmpty
} from "../../utils/functional";

export default function AttributeList(props) {
  const [value, setValue] = useState([{}]);
  const { addItem, removeItem } = CollectionBehaviour(props, value);

  const ensureValue = _ => {
    const v = list(_);
    return isEmpty(last(v)) ? v.concat([{}]) : v;
  };

  const onItemChange = (v, a, k, i) => {
    setValue(ensureValue(setnth(value, i, merge(value[i], dict([[k, v]])))));
  };

  return (
    <div className="AttributeList">
      {list(value).map((v, i) => (
        <Attribute
          value={value[i]}
          key={i}
          onRemove={removeItem}
          onChange={(v, a, k) => onItemChange(v, a, k, i)}
        />
      ))}
    </div>
  );
}
