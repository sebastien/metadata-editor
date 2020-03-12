class API {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  fetchJSON(url: string): Promise<any> {
    return fetch(`${this.prefix}${url}`).then(_ => _.json());
  }
  putJSON(url: string, data): Promise<any> {
    return fetch(`${this.prefix}${url}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }).then(_ => _.json());
  }

  listDatasets(): Promise<Array<string>> {
    return this.fetchJSON(`dataset/?meta`);
  }

  listDatasetDimensions(dataset: string): Promise<Array<string>> {
    return this.fetchJSON(`dataset/${dataset}/dimension/`);
  }

  getDatasetMetaData(dataset: string): Promise<Object> {
    return this.fetchJSON(`dataset/${dataset}:meta`);
  }

  getDatasetDataPreview(dataset: string): Promise<Object> {
    return this.fetchJSON(`dataset/${dataset}/preview`);
  }

  saveDatasetMetaData(dataset: string, data: Object): Promise<Object> {
    return this.putJSON(`dataset/${dataset}:meta`, data);
  }
}

export const api: API = new API("https://APPDEV62/");

export default API;
