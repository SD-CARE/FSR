import axios from "axios";
export default class CPData {
  // EXTERNAL API

  // Get token from api
  async getToken() {
    const options = {
      method: "POST",
      url: process.env.REACT_APP_TOKEN_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        grant_type: "client_credentials",
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        organisation_name: process.env.REACT_APP_ORGANISATION_NAME,
      },
    };
    try {
      const response = await axios(options);
      const token = response.data.access_token;
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  // Get data from external api
  exAPi(path, method = "GET", body = null) {
    return this.getToken().then((token) => {
      const options = {
        method,
        url: process.env.REACT_APP_SERVER_URL + path,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "CP-Org-Name": process.env.REACT_APP_ORGANISATION_NAME,
        },
      };
      // if the body is not null
      if (body !== null) {
        // add the body to the options and turn JSON to string formate
        options.body = JSON.stringify(body);
      }
      const response = axios(options);
      return response;
    });
  }

  // Get All Carers
  async getAllCarers() {
    const response = await this.exAPi("carers?limit=200");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get All Clients
  async getAllClients() {
    const response = await this.exAPi("clients?limit=200");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get a client by id
  async getClients(clients_id) {
    const response = await this.exAPi(
      `clients?&filters={"identifiers":[${clients_id}]}`
    );
    if (response.status === 200) {
      if (response.data.length > 0) {
        return response.data;
      } else {
        return null;
      }
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
  // get scheduleby id
  async getSchedule(schedule_id) {
    const response = await this.exAPi(`schedules/${schedule_id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }

  // Get Apointments by carer
  async appointments(carerID, startDate, endDate, clientRegions) {
    const response = await this.exAPi(
      `carers/${carerID}/appointments?&filters={"start":"${startDate}","end":"${endDate}","clientRegions":[${clientRegions}]}`
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Something went wrong: ${response.status}`);
    }
  }
}
