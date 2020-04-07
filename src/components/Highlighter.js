import React from "react";

const remap = (text, re, callback) => {
    const res = [];
    // NOTE: This is not ideal as it requires modifying the string
    var t = text;
    while (t && t.length > 0) {
        const m = t.match(re);
        if (m) {
            const i = m.index;
            const j = i + m[0].length;
            if (i > 0) {
                res.push(callback("text", t.substring(0, i), res.length));
            }
            res.push(callback("match", t.substring(i, j), res.length, m));
            t = t.substring(j);
        } else {
            res.push(callback("text", t, res.length));
            return res;
        }
    }
    return res;
};

export default function Highlighter(props) {
    const text = props.text;
    const query =
        typeof props.query === "string"
            ? new RegExp(props.query, "i")
            : props.query;
    if (!query || typeof text !== "string") {
        return text;
    } else {
        return (
            <span className="Highlighter">
                {remap(text, query, (v, t, i) =>
                    v === "text" ? (
                        t
                    ) : (
                        <em className="Highlighter-match" key={i}>
                            {t}
                        </em>
                    )
                )}
            </span>
        );
    }
}
