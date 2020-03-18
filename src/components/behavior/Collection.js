export default function CollectionBehavior(props, value) {
  // FIXME: Does not preserve integrity
  const addItem = _ => {
    props.onChange(value.concat([{ key: undefined, value: undefined }]));
  };

  const removeItem = i => {
    const v = value.filter((v, j) => i !== j);
    return props.onChange ? props.onChange(v, props.id) : undefined;
  };

  const renameItem = (i, k) => {
    const v = value.map((v, j) => (i === j ? { ...v, key: k } : v));
    return props.onChange ? props.onChange(v, props.id) : undefined;
  };

  const setItem = (i, o) => {
    const v = value.map((v, j) => (i === j ? { ...v, value: o } : v));
    return props.onChange ? props.onChange(v, props.id) : undefined;
  };

  const moveUp = i => {
    if (i > 0) {
      const v = value.slice(0, i - 1);
      v.push(value[i]);
      v.push(value[i - 1]);
      return props.onChange
        ? props.onChange(v.concat(value.slice(i + 1)), props.id)
        : undefined;
    }
  };

  const moveDown = i => {
    if (i < value.length - 1) {
      const v = value.slice(0, i);
      v.push(value[i + 1]);
      v.push(value[i]);
      return props.onChange
        ? props.onChange(v.concat(value.slice(i + 2)), props.id)
        : undefined;
    }
  };
  return { addItem, removeItem, renameItem, setItem, moveUp, moveDown };
}
