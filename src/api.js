class API {
    constructor(prefix) {
        this.prefix = prefix;
    }

    fetchJSON(url) {
        return fetch(`${this.prefix}${url}`).then(_ => _.json());
    }
    putJSON(url, data) {
        return fetch(`${this.prefix}${url}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }).then(_ => _.json());
    }

    listDatasets() {
        return this.fetchJSON(`dataset/?meta`);
    }

    listDatasetFields(dataset) {
        return this.fetchJSON(`dataset/${dataset}/field/`);
    }

    getDatasetMetaData(dataset) {
        return this.fetchJSON(`dataset/${dataset}:meta`);
    }

    getDatasetDataPreview(dataset) {
        return this.fetchJSON(`dataset/${dataset}/preview`);
    }

    getDatasetFieldDistribution(dataset, field) {
        return this.fetchJSON(`dataset/${dataset}/field/${field}/distribution`);
    }

    saveDatasetMetaData(dataset, data) {
        return this.putJSON(`dataset/${dataset}:meta`, data);
    }

    linkToDatasets(prefix) {
        return prefix ? `/datasets/${prefix}` : "datasets";
    }

    linkToDataset(name) {
        return `/dataset/${name}`;
    }
    linkToDatasetSchema() {
        return "schema.json";
    }
}

export const api = new API("https://localhost:8003/api/0.0/");

export default API;
