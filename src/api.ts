class API {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  fetchJSON(url: string): Promise<any> {
    return fetch(`${this.prefix}${url}`).then(_ => _.json());
  }

  listDatasets(): Promise<Array<string>> {
    return this.fetchJSON(`dataset/list`);
  }
  getDataset(dataset: string): Promise<Object> {
    return this.fetchJSON(`dataset/${dataset}`);
  }
}

export const api: API = new API("https://APPDEV62/");

export default API;
