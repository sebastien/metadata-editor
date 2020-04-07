const prefixFilter = prefix =>
    prefix instanceof RegExp ? prefix : new RegExp(`^\s*${prefix}`, "i");
const keywordFilter = keyword =>
    keyword instanceof RegExp ? keyword : new RegExp(`${keyword}`, "i");
