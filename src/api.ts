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
    return this.fetchJSON(`dataset/list`);
  }
  getDataset(dataset: string): Promise<Object> {
    return this.fetchJSON(`dataset/${dataset}`);
  }
  saveDataset(dataset: string, data: Object): Promise<Object> {
    console.log("Saving dataset", dataset, ":", data);
    return this.putJSON(`dataset/${dataset}`, data);
  }
}

export const api: API = new API("https://APPDEV62/");

export default API;
