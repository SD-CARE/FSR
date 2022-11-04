import { api } from "./Config";
export default class CPData {
  exAPi(path, method = "GET", body = null) {
    // create a url constant to store the url from config and the path
    const url = api.externalAPI + path;
    // create the options object with the method and headers
    // if the body is not null

    // return the fetched data
    return fetch(url);
  }

  // Get All Carers
  async getAllCarers() {
    const response = await this.exAPi("carers?limit=200");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get All Clients
  async getAllClients() {
    const response = await this.exAPi("clients?limit=200");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get a carer by id
  async getCarer(carer_id) {
    const response = await this.exAPi(
      `carer?filters={"identifiers":[${carer_id}]}`
    );
    if (response.status === 200) {
      if (response) {
        return response.json().then((data) => data);
      } else {
        return null;
      }
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get a client by id
  async getClient(clients_id) {
    const response = await this.exAPi(
      `client?filters={"identifiers":[${clients_id}]}`
    );
    if (response.status === 200) {
      if (response) {
        return response.json().then((data) => data);
      } else {
        return null;
      }
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
  // get scheduleby id
  async allRegions() {
    const response = await this.exAPi(`regions?limit=200`);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  async allruns() {
    const response = await this.exAPi(`appointment-runs?limit=200`);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get Apointments by carer
  async appointments(carer, start, end, clientRegions) {
    const response = await this.exAPi(
      `appointments/?singlecarer=${carer}/appointments&filters={"start":"${start}","end":"${end}","clientRegions":[${clientRegions}]}`
    );
    if (response.status === 200) {
      if (response) {
        return response.json().then((data) => data);
      }
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
}
