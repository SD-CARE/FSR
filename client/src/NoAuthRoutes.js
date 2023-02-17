import { api } from "./Config";

export default class noAuthRoutes {
  // OUR API
  // create an api funtion with path, method, body, requiresAuth, credentials as params
  // set method to defualt(GET) body(null) requiresAuth(false), credentials(null)
  api(
    path,
    method = "GET",
    body = null,
    requiresAuth = false,
    credentials = null
  ) {
    // create a url constant to store the url from config and the path
    const url = api.apiBaseUrl + path;
    // create the options object with the method and headers
    const options = {
      method,
      //   headers hold the content-type which is in JSON
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    // if the body is not null
    if (body !== null) {
      // add the body to the options and turn JSON to string formate
      options.body = JSON.stringify(body);
    }

    // if requiresAuth is true
    if (requiresAuth) {
      // create the encodedCredentials constant to store the encyripted user data using (btoa)
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );
      // add "Authorization" to the options headers object and set it to the encyripted encodedCredentials data
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }
    // return the fetched data
    return fetch(url, options);
  }

  //   USER

  // create the createUser async function
  async createUser(user) {
    // create a response constant to save the data that POST to the api
    const response = await this.api("/users", "POST", user);
    // if the post was successful
    if (response.status === 201) {
      // return nothing
      return [];
      // else if the post had a problem
    } else if (response.status === 400) {
      // return a response as JSOn then
      return response.json().then((data) => {
        // return the errors
        return data.errors;
      });
      // else throw any other errors from the api
    } else {
      throw new Error("Something went wrong");
    }
  }
  // create a getUser async function with emailAddress and password as params
  async getUser(emailAddress, password) {
    // create the response constant and wait for the api function with the path as "/users" a GET method body
    // set to null and requiresAuth set to true
    const response = await this.api("/users", "GET", null, true, {
      emailAddress,
      password,
    });

    // if the response is ok
    if (response.status === 200) {
      // return the json data and then save it as data
      return response.json().then((data) => data);
      // else id the response has any problem
    } else if (
      response.status === 401 ||
      response.status === 400 ||
      response.status === 500
      // return null
    ) {
      return null;
      // else throw an error from the api response
    } else {
      throw new Error("Something went wrong");
    }
  }

  // Create all Clients into the database
  async createClients(clients) {
    const response = await this.api("/clients", "POST", clients);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get all Clients
  async getClients() {
    const response = await this.api("/clients");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  async createCarers(carers) {
    const response = await this.api("/carers", "POST", carers);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  //   CARERS

  // create the getCourse async function
  async getCarers() {
    // create the response constant to save the data for all the courses
    const response = await this.api("/carers");
    // if the response is ok
    if (response.status === 200) {
      // retuten a json object then save the data as data
      return response.json().then((data) => data);
      // else throw the errors from the api
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get single Carer
  async getCarer(id) {
    const response = await this.api(`/carers/${id}`);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Create Carer NPC for new carer from JSON file
  async createCarerNPC(carerNPC) {
    // create the response constant to hold the post requst to the api with requireAuth set to true
    const response = await this.api("/write", "POST", carerNPC);
    // if the response status is 200
    if (response.status === 201) {
      //  return an empty array
      return [];
      // else if response status is 400
    } else if (response.status === 400) {
      // return response data in json then
      return response.json().then((data) => {
        // return the errors
        return data.errors;
      });
      // else throw the errors from the api
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get the NPC data from the JSON file
  async getCarerNPC() {
    // create the response constant to hold the data from the api
    const response = await this.api("/write");
    // if the response is ok
    if (response.status === 200) {
      // return the data in json then save it as data
      return response.json().then((data) => data);
      // else throw the errors from the api
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // REGIONS
  async createRegions(region) {
    const response = await this.api("/regions", "POST", region);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get regions
  async getRegions() {
    const response = await this.api("/regions");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // SET CARER_REGION
  async setCarerRegion(carerRegion) {
    const response = await this.api("/carer_region", "POST", carerRegion);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get carer_region
  async getCarerRegion() {
    const response = await this.api("/carer_region");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // SET CLIENT_REGION
  async setClientRegion(clientRegion) {
    const response = await this.api("/client_region", "POST", clientRegion);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get client_region
  async getClientRegion() {
    const response = await this.api("/client_region");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // METRICS
  async createMetrics(metric) {
    const response = await this.api("/metrics", "POST", metric);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get metrics
  async getMetrics() {
    const response = await this.api("/metrics");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // POC
  async createPOC(poc) {
    const response = await this.api("/poc", "POST", poc);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get poc
  async getPOC() {
    const response = await this.api("/poc");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // CALLS
  async createCalls(call) {
    const response = await this.api("/calls", "POST", call);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get calls
  async getCalls() {
    const response = await this.api("/calls");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  //  RATINGS
  async createRatings(rating) {
    const response = await this.api("/ratings", "POST", rating);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
  // get ratings
  async getRatings() {
    const response = await this.api("/ratings");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // COMPLIED
  async createComplied(complied) {
    const response = await this.api("/complied", "POST", complied);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
  // get complied
  async getComplied() {
    const response = await this.api("/complied");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // create clientCalls
  async createClientCalls(clientCall) {
    const response = await this.api("/client_calls", "POST", clientCall);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get clientCalls
  async getClientCalls() {
    const response = await this.api("/client_calls");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // create client_poc
  async createClientPOC(clientpoc) {
    const response = await this.api("/client_poc", "POST", clientpoc);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get client_poc
  async getClientPOC() {
    const response = await this.api("/client_poc");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // create metric_ratings
  async createMetricRatings(metricRating) {
    const response = await this.api("/metric_rating", "POST", metricRating);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get metric_ratings
  async getMetricRatings() {
    const response = await this.api("/metric_rating");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // create metric_complied
  async createMetricComplied(metricComplied) {
    const response = await this.api("/metric_complied", "POST", metricComplied);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get metric_complied
  async getMetricComplied() {
    const response = await this.api("/metric_complied");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // COMMENTS
  async createComments(comments) {
    const response = await this.api("/comments", "POST", comments);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get comments
  async getComments() {
    const response = await this.api("/comments");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // CARER_CLIENT
  async setCarerClients(carerClient) {
    const response = await this.api("/carer_client", "POST", carerClient);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // get carer_client
  async getCarerClients() {
    const response = await this.api("/carer_client");
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // -------End of API functions-------//
}
